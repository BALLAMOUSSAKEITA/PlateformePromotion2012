from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from dependencies import get_current_admin
import models, schemas, auth

router = APIRouter(prefix="/admin", tags=["Administration"])


@router.post("/connexion", response_model=schemas.Token)
def admin_login(data: schemas.AdminLoginRequest, db: Session = Depends(get_db)):
    if data.username != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants incorrects.",
        )
    admin = db.query(models.Member).filter(
        models.Member.phone == "admin",
        models.Member.is_admin == True,
    ).first()
    if not admin or not auth.verify_password(data.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants incorrects.",
        )
    token = auth.create_access_token({"sub": str(admin.id)})
    return {"access_token": token, "token_type": "bearer", "member": admin}


@router.get("/membres", response_model=List[schemas.MemberOut])
def list_membres(
    db: Session = Depends(get_db),
    _: models.Member = Depends(get_current_admin),
):
    return db.query(models.Member).filter(models.Member.is_admin == False).order_by(models.Member.created_at.desc()).all()


@router.delete("/membres/{member_id}", status_code=204)
def delete_membre(
    member_id: int,
    db: Session = Depends(get_db),
    _: models.Member = Depends(get_current_admin),
):
    member = db.query(models.Member).filter(
        models.Member.id == member_id,
        models.Member.is_admin == False,
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="Membre introuvable.")
    db.delete(member)
    db.commit()
