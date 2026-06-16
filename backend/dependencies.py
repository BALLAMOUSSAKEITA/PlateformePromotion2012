from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
import models, auth

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/connexion")


def get_current_member(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> models.Member:
    payload = auth.decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide ou expiré.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    member_id = payload.get("sub")
    member = db.query(models.Member).filter(models.Member.id == int(member_id)).first()
    if not member:
        raise HTTPException(status_code=404, detail="Membre introuvable.")
    return member


def get_current_admin(
    current_member: models.Member = Depends(get_current_member),
) -> models.Member:
    if not current_member.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux administrateurs.",
        )
    return current_member
