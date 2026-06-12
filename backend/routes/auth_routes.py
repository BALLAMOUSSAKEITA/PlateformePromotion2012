from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, auth

router = APIRouter(prefix="/auth", tags=["Authentification"])


@router.post("/inscription", response_model=schemas.Token, status_code=201)
def inscription(data: schemas.MemberCreate, db: Session = Depends(get_db)):
    existing = auth.get_member_by_phone(db, data.phone)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un compte existe déjà avec ce numéro de téléphone.",
        )

    if data.contact_email:
        existing_email = db.query(models.Member).filter(
            models.Member.contact_email == data.contact_email.lower().strip()
        ).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Un compte existe déjà avec cette adresse email.",
            )

    member_number = auth.generate_member_number(db)
    new_member = models.Member(
        email=auth.internal_email_from_phone(data.phone),
        hashed_password=auth.hash_password(data.password),
        first_name=data.first_name.strip(),
        last_name=data.last_name.strip(),
        phone=data.phone.strip(),
        contact_email=data.contact_email.lower().strip() if data.contact_email else None,
        school=data.school.strip(),
        option=data.option.strip(),
        profession=data.profession.strip(),
        current_activity=data.current_activity.strip() if data.current_activity else None,
        country=data.country.strip(),
        city=data.city.strip(),
        member_number=member_number,
    )
    db.add(new_member)
    db.commit()
    db.refresh(new_member)

    token = auth.create_access_token({"sub": str(new_member.id)})
    return {"access_token": token, "token_type": "bearer", "member": new_member}


@router.post("/connexion", response_model=schemas.Token)
def connexion(data: schemas.LoginRequest, db: Session = Depends(get_db)):
    member = auth.get_member_by_phone(db, data.phone)
    if not member or not auth.verify_password(data.password, member.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Téléphone ou mot de passe incorrect.",
        )

    token = auth.create_access_token({"sub": str(member.id)})
    return {"access_token": token, "token_type": "bearer", "member": member}
