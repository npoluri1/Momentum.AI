import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ─── Generic API Response ───────────────────────────────────────────
class APIResponse(BaseModel):
    success: bool = True
    message: str = "OK"
    data: dict | list | None = None


class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error_code: str | None = None
    details: dict | None = None


class PaginatedResponse(BaseModel):
    success: bool = True
    items: list
    total: int
    page: int
    page_size: int
    total_pages: int


# ─── Auth ────────────────────────────────────────────────────────────
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenRefreshRequest(BaseModel):
    refresh_token: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    name: str = Field(..., min_length=1, max_length=255)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)


# ─── User ────────────────────────────────────────────────────────────
class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(..., max_length=255)


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)


class UserUpdate(BaseModel):
    name: str | None = Field(None, max_length=255)
    avatar_url: str | None = None


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    organization_id: uuid.UUID | None = None
    role: str
    is_active: bool
    is_superuser: bool
    email_verified: bool
    avatar_url: str | None = None
    created_at: datetime
    updated_at: datetime


class UserProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    name: str
    role: str
    organization_id: uuid.UUID | None = None
    organization_name: str | None = None
    avatar_url: str | None = None
    email_verified: bool
    created_at: datetime


# ─── Organization ────────────────────────────────────────────────────
class OrganizationBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=255, pattern=r"^[a-z0-9-]+$")


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(BaseModel):
    name: str | None = Field(None, max_length=255)
    settings: dict | None = None
    logo_url: str | None = None


class OrganizationResponse(OrganizationBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    plan: str
    settings: dict | None = None
    logo_url: str | None = None
    created_at: datetime
    updated_at: datetime


class OrganizationMemberResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    name: str
    role: str
    is_active: bool
    avatar_url: str | None = None
    created_at: datetime


class InviteMemberRequest(BaseModel):
    email: EmailStr
    role: str = Field(default="member", pattern=r"^(admin|member|viewer)$")


# ─── Health ──────────────────────────────────────────────────────────
class HealthResponse(BaseModel):
    status: str = "healthy"
    version: str = "1.0.0"
    services: dict[str, str] | None = None
