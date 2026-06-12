import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from database import get_db
from config import settings
import models, schemas, auth
from services.card_generator import generate_member_card
from dependencies import get_current_member

router = APIRouter(prefix="/membres", tags=["Membres"])

ALLOWED_IMAGE_TYPES = ("image/jpeg", "image/png", "image/webp")
ALLOWED_CV_TYPES = ("application/pdf", "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document")


@router.get("/moi", response_model=schemas.MemberOut)
def get_me(current_member: models.Member = Depends(get_current_member)):
    return current_member


@router.get("/{member_number}/verifier", response_model=schemas.VerifyMemberOut)
def verify_member(member_number: str, db: Session = Depends(get_db)):
    member = (
        db.query(models.Member)
        .filter(models.Member.member_number == member_number)
        .first()
    )
    if not member:
        raise HTTPException(status_code=404, detail="Membre introuvable.")
    return member


@router.get("/{member_number}/carte")
def get_card(member_number: str, db: Session = Depends(get_db)):
    member = (
        db.query(models.Member)
        .filter(models.Member.member_number == member_number)
        .first()
    )
    if not member:
        raise HTTPException(status_code=404, detail="Membre introuvable.")

    card_path = generate_member_card(member, settings.BASE_URL)
    return FileResponse(
        card_path,
        media_type="image/png",
        filename=f"carte-{member_number}.png",
    )


@router.post("/moi/photo")
def upload_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_member: models.Member = Depends(get_current_member),
):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Format non supporté (jpg/png/webp).")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = (file.filename or "photo.jpg").rsplit(".", 1)[-1]
    filename = f"{current_member.member_number}_photo.{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    current_member.photo_url = f"{settings.BASE_URL}/uploads/{filename}"
    db.commit()
    db.refresh(current_member)
    return {"photo_url": current_member.photo_url}


@router.post("/moi/cv")
def upload_cv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_member: models.Member = Depends(get_current_member),
):
    if file.content_type not in ALLOWED_CV_TYPES:
        raise HTTPException(status_code=400, detail="Format non supporté (pdf/doc/docx).")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = (file.filename or "cv.pdf").rsplit(".", 1)[-1]
    filename = f"{current_member.member_number}_cv.{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    current_member.cv_url = f"{settings.BASE_URL}/uploads/{filename}"
    db.commit()
    db.refresh(current_member)
    return {"cv_url": current_member.cv_url}


@router.put("/moi", response_model=schemas.MemberOut)
def update_me(
    data: schemas.MemberUpdate,
    db: Session = Depends(get_db),
    current_member: models.Member = Depends(get_current_member),
):
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(current_member, field, value)
    db.commit()
    db.refresh(current_member)
    return current_member
