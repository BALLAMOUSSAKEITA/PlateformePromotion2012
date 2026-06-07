from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class MemberCreate(BaseModel):
    password: str
    first_name: str
    last_name: str
    phone: str
    school: str
    profession: str
    city: str


class MemberUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    school: Optional[str] = None
    profession: Optional[str] = None
    city: Optional[str] = None


class MemberOut(BaseModel):
    id: int
    member_number: str
    email: str
    first_name: str
    last_name: str
    phone: str
    school: Optional[str] = None
    profession: Optional[str] = None
    city: Optional[str] = None
    filiere: Optional[str] = None
    photo_url: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


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
    profession: Optional[str] = None
    city: Optional[str] = None
    filiere: Optional[str] = None
    status: str
    photo_url: Optional[str] = None
