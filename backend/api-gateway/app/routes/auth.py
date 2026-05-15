import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.middleware.auth import get_current_user, require_roles
from app.models.user import User
from app.schemas import (
    APIResponse,
    LoginRequest,
    PasswordResetConfirm,
    PasswordResetRequest,
    RegisterRequest,
    TokenRefreshRequest,
    TokenResponse,
    UserResponse,
)
from app.services.auth_service import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
    verify_refresh_token,
)
from app.config import get_settings

settings = get_settings()
router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def register(
    body: RegisterRequest,
    session: AsyncSession = Depends(get_session),
):
    existing = await session.execute(
        select(User).where(User.email == body.email)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = User(
        id=uuid.uuid4(),
        email=body.email,
        name=body.name,
        hashed_password=hash_password(body.password),
        role="member",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    session.add(user)
    await session.flush()

    access_token = create_access_token(user.id, user.role)
    refresh_token = create_refresh_token(user.id)

    user.refresh_token = refresh_token
    await session.flush()

    return APIResponse(
        message="Registration successful",
        data={
            "user": UserResponse.model_validate(user).model_dump(mode="json"),
            "tokens": TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            ).model_dump(),
        },
    )


@router.post("/login", response_model=APIResponse)
async def login(
    body: LoginRequest,
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(User).where(User.email == body.email)
    )
    user = result.scalar_one_or_none()

    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    access_token = create_access_token(user.id, user.role)
    refresh_token = create_refresh_token(user.id)

    user.refresh_token = refresh_token
    user.updated_at = datetime.now(timezone.utc)
    await session.flush()

    return APIResponse(
        message="Login successful",
        data={
            "user": UserResponse.model_validate(user).model_dump(mode="json"),
            "tokens": TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            ).model_dump(),
        },
    )


@router.post("/refresh", response_model=APIResponse)
async def refresh_token(
    body: TokenRefreshRequest,
    session: AsyncSession = Depends(get_session),
):
    try:
        payload = verify_refresh_token(body.refresh_token)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )

    user_id = payload.get("sub")
    result = await session.execute(
        select(User).where(User.id == uuid.UUID(user_id))
    )
    user = result.scalar_one_or_none()

    if not user or user.refresh_token != body.refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    new_access = create_access_token(user.id, user.role)
    new_refresh = create_refresh_token(user.id)
    user.refresh_token = new_refresh
    user.updated_at = datetime.now(timezone.utc)
    await session.flush()

    return APIResponse(
        message="Token refreshed",
        data={
            "tokens": TokenResponse(
                access_token=new_access,
                refresh_token=new_refresh,
                expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            ).model_dump(),
        },
    )


@router.post("/logout", response_model=APIResponse)
async def logout(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    current_user.refresh_token = None
    current_user.updated_at = datetime.now(timezone.utc)
    await session.flush()
    return APIResponse(message="Logged out successfully")


@router.post("/password-reset-request", response_model=APIResponse)
async def password_reset_request(
    body: PasswordResetRequest,
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(User).where(User.email == body.email)
    )
    user = result.scalar_one_or_none()
    if user:
        reset_token = create_access_token(
            user.id, user.role, expires_delta=15
        )
        # In production, send email with reset_token here
        return APIResponse(
            message="Password reset email sent",
            data={"reset_token": reset_token} if settings.DEBUG else None,
        )
    return APIResponse(message="Password reset email sent")


@router.post("/password-reset-confirm", response_model=APIResponse)
async def password_reset_confirm(
    body: PasswordResetConfirm,
    session: AsyncSession = Depends(get_session),
):
    try:
        payload = decode_token(body.token)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    user_id = payload.get("sub")
    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset token",
        )

    result = await session.execute(
        select(User).where(User.id == uuid.UUID(user_id))
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.hashed_password = hash_password(body.new_password)
    user.refresh_token = None
    user.updated_at = datetime.now(timezone.utc)
    await session.flush()

    return APIResponse(message="Password reset successful")
