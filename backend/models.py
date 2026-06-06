import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum, Text
from database import Base


class StatusEnum(str, enum.Enum):
    actif = "actif"
    inactif = "inactif"
    en_attente = "en_attente"


class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    member_number = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    filiere = Column(String(150), nullable=True)
    photo_url = Column(String(500), nullable=True)

    status = Column(Enum(StatusEnum), default=StatusEnum.actif)
    is_admin = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
