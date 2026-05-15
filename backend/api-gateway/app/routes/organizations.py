import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.middleware.auth import get_current_user, require_roles, require_organization_access
from app.models.organization import Organization
from app.models.user import User
from app.schemas import (
    APIResponse,
    InviteMemberRequest,
    OrganizationCreate,
    OrganizationMemberResponse,
    OrganizationResponse,
    OrganizationUpdate,
    UserResponse,
)
from app.services.cache_service import cache_service

router = APIRouter(prefix="/organizations", tags=["Organizations"])


@router.post("/", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def create_organization(
    body: OrganizationCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    slug_exists = await session.execute(
        select(Organization).where(Organization.slug == body.slug)
    )
    if slug_exists.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Organization slug already taken",
        )

    org = Organization(
        id=uuid.uuid4(),
        name=body.name,
        slug=body.slug,
        plan="free",
        settings={},
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    session.add(org)
    await session.flush()

    current_user.organization_id = org.id
    current_user.role = "admin"
    current_user.updated_at = datetime.now(timezone.utc)
    await session.flush()

    return APIResponse(
        message="Organization created",
        data=OrganizationResponse.model_validate(org).model_dump(mode="json"),
    )


@router.get("/mine", response_model=APIResponse)
async def get_my_organization(
    current_user: User = Depends(require_organization_access),
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(Organization).where(Organization.id == current_user.organization_id)
    )
    org = result.scalar_one_or_none()
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    return APIResponse(
        data=OrganizationResponse.model_validate(org).model_dump(mode="json")
    )


@router.get("/{org_id}", response_model=APIResponse)
async def get_organization(
    org_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    cached = await cache_service.get(f"org:{org_id}")
    if cached:
        return APIResponse(data=cached)

    result = await session.execute(
        select(Organization).where(Organization.id == org_id)
    )
    org = result.scalar_one_or_none()
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )

    resp = OrganizationResponse.model_validate(org).model_dump(mode="json")
    await cache_service.set(f"org:{org_id}", resp, ttl=300)
    return APIResponse(data=resp)


@router.patch("/{org_id}", response_model=APIResponse)
async def update_organization(
    org_id: uuid.UUID,
    body: OrganizationUpdate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_roles(["admin", "superadmin"])),
):
    result = await session.execute(
        select(Organization).where(Organization.id == org_id)
    )
    org = result.scalar_one_or_none()
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )

    if body.name is not None:
        org.name = body.name
    if body.settings is not None:
        org.settings = body.settings
    if body.logo_url is not None:
        org.logo_url = body.logo_url

    org.updated_at = datetime.now(timezone.utc)
    await session.flush()
    await cache_service.delete(f"org:{org_id}")

    return APIResponse(
        message="Organization updated",
        data=OrganizationResponse.model_validate(org).model_dump(mode="json"),
    )


@router.delete("/{org_id}", response_model=APIResponse)
async def delete_organization(
    org_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_roles(["admin", "superadmin"])),
):
    result = await session.execute(
        select(Organization).where(Organization.id == org_id)
    )
    org = result.scalar_one_or_none()
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )

    await session.delete(org)
    await cache_service.delete(f"org:{org_id}")
    await cache_service.invalidate_pattern(f"org:{org_id}:*")
    return APIResponse(message="Organization deleted")


@router.get("/{org_id}/members", response_model=APIResponse)
async def list_members(
    org_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    result = await session.execute(
        select(User).where(
            User.organization_id == org_id
        ).order_by(User.created_at.asc())
    )
    members = result.scalars().all()

    return APIResponse(
        data={
            "items": [
                OrganizationMemberResponse.model_validate(m).model_dump(mode="json")
                for m in members
            ],
            "total": len(members),
        }
    )


@router.post("/{org_id}/invite", response_model=APIResponse)
async def invite_member(
    org_id: uuid.UUID,
    body: InviteMemberRequest,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_roles(["admin", "superadmin"])),
):
    org_result = await session.execute(
        select(Organization).where(Organization.id == org_id)
    )
    org = org_result.scalar_one_or_none()
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )

    user_result = await session.execute(
        select(User).where(User.email == body.email)
    )
    user = user_result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with that email not found",
        )

    if user.organization_id is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already belongs to an organization",
        )

    user.organization_id = org_id
    user.role = body.role
    user.updated_at = datetime.now(timezone.utc)
    await session.flush()

    return APIResponse(
        message=f"User {body.email} invited as {body.role}",
        data=UserResponse.model_validate(user).model_dump(mode="json"),
    )


@router.patch("/{org_id}/members/{user_id}/role", response_model=APIResponse)
async def update_member_role(
    org_id: uuid.UUID,
    user_id: uuid.UUID,
    body: InviteMemberRequest,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_roles(["admin", "superadmin"])),
):
    result = await session.execute(
        select(User).where(
            User.id == user_id,
            User.organization_id == org_id,
        )
    )
    member = result.scalar_one_or_none()
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found in this organization",
        )

    member.role = body.role
    member.updated_at = datetime.now(timezone.utc)
    await session.flush()

    return APIResponse(
        message=f"Member role updated to {body.role}",
        data=UserResponse.model_validate(member).model_dump(mode="json"),
    )


@router.delete("/{org_id}/members/{user_id}", response_model=APIResponse)
async def remove_member(
    org_id: uuid.UUID,
    user_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_roles(["admin", "superadmin"])),
):
    result = await session.execute(
        select(User).where(
            User.id == user_id,
            User.organization_id == org_id,
        )
    )
    member = result.scalar_one_or_none()
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found in this organization",
        )

    member.organization_id = None
    member.role = "member"
    member.updated_at = datetime.now(timezone.utc)
    await session.flush()

    return APIResponse(message="Member removed from organization")
