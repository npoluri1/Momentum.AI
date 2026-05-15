import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.middleware.auth import get_current_user, require_roles, require_organization_access
from app.models.user import User
from app.schemas import (
    APIResponse,
    UserResponse,
    UserUpdate,
    UserProfileResponse,
)
from app.services.cache_service import cache_service

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=APIResponse)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
):
    org_name = None
    if current_user.organization:
        org_name = current_user.organization.name

    profile = UserProfileResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        role=current_user.role,
        organization_id=current_user.organization_id,
        organization_name=org_name,
        avatar_url=current_user.avatar_url,
        email_verified=current_user.email_verified,
        created_at=current_user.created_at,
    )
    return APIResponse(data=profile.model_dump(mode="json"))


@router.patch("/me", response_model=APIResponse)
async def update_my_profile(
    body: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    if body.name is not None:
        current_user.name = body.name
    if body.avatar_url is not None:
        current_user.avatar_url = body.avatar_url

    current_user.updated_at = datetime.now(timezone.utc)
    await session.flush()
    await cache_service.delete(f"user:{current_user.id}")

    return APIResponse(
        message="Profile updated",
        data=UserResponse.model_validate(current_user).model_dump(mode="json"),
    )


@router.get("/", response_model=APIResponse)
async def list_users(
    page: int = 1,
    page_size: int = 20,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_roles(["admin", "superadmin"])),
):
    offset = (page - 1) * page_size
    result = await session.execute(
        select(User).offset(offset).limit(page_size).order_by(User.created_at.desc())
    )
    users = result.scalars().all()

    count_result = await session.execute(select(User.id))
    total = len(count_result.scalars().all())

    return APIResponse(
        data={
            "items": [UserResponse.model_validate(u).model_dump(mode="json") for u in users],
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size,
        }
    )


@router.get("/{user_id}", response_model=APIResponse)
async def get_user(
    user_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    cached = await cache_service.get(f"user:{user_id}")
    if cached:
        return APIResponse(data=cached)

    result = await session.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    resp = UserResponse.model_validate(user).model_dump(mode="json")
    await cache_service.set(f"user:{user_id}", resp, ttl=300)
    return APIResponse(data=resp)


@router.delete("/{user_id}", response_model=APIResponse)
async def delete_user(
    user_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_roles(["admin", "superadmin"])),
):
    result = await session.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    await session.delete(user)
    await cache_service.delete(f"user:{user_id}")
    return APIResponse(message="User deleted")
