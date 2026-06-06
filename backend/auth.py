from datetime import datetime, timedelta
from typing import Optional
import bcrypt
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from config import settings
import models


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None


def get_member_by_email(db: Session, email: str):
    return db.query(models.Member).filter(models.Member.email == email).first()


def generate_member_number(db: Session) -> str:
    count = db.query(models.Member).count()
    return f"FILI-2012-{str(count + 1).zfill(4)}"
