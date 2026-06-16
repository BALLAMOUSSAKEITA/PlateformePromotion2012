from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class MemberCreate(BaseModel):
    password: str
    first_name: str
    last_name: str
    phone: str
    school: str
    option: str
    profession: str
    current_activity: Optional[str] = None
    country: str
    city: str
    contact_email: Optional[str] = None


class MemberUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    contact_email: Optional[str] = None
    school: Optional[str] = None
    option: Optional[str] = None
    profession: Optional[str] = None
    current_activity: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None


class MemberOut(BaseModel):
    id: int
    member_number: str
    first_name: str
    last_name: str
    phone: str
    contact_email: Optional[str] = None
    school: Optional[str] = None
    option: Optional[str] = None
    profession: Optional[str] = None
    current_activity: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    photo_url: Optional[str] = None
    cv_url: Optional[str] = None
    status: str
    is_admin: bool = False
    created_at: datetime

    class Config:
        from_attributes = True


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class LoginRequest(BaseModel):
    phone: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    member: MemberOut


class VerifyMemberOut(BaseModel):
    member_number: str
    first_name: str
    last_name: str
    school: Optional[str] = None
    option: Optional[str] = None
    profession: Optional[str] = None
    current_activity: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    status: str
    photo_url: Optional[str] = None
