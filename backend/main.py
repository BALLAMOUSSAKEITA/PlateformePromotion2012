import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import Base, engine, migrate_db, SessionLocal
from routes.auth_routes import router as auth_router
from routes.member_routes import router as member_router
from routes.admin_routes import router as admin_router
from config import settings
import models, auth

Base.metadata.create_all(bind=engine)
migrate_db()


def seed_admin():
    """Crée le compte admin par défaut s'il n'existe pas."""
    db = SessionLocal()
    try:
        existing = db.query(models.Member).filter(models.Member.phone == "admin").first()
        if not existing:
            admin = models.Member(
                email="admin@filifing.local",
                hashed_password=auth.hash_password("admin"),
                first_name="Admin",
                last_name="Filifing",
                phone="admin",
                member_number="ADMIN-0000",
                school="—",
                option="—",
                profession="Administrateur",
                country="—",
                city="—",
                is_admin=True,
            )
            db.add(admin)
            db.commit()
    finally:
        db.close()


seed_admin()

app = FastAPI(
    title="Anciens Élèves de Siguiri – Promotion 2012 API",
    description="Plateforme de l'Association des Anciens Élèves de Siguiri - Promotion 2012",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.include_router(auth_router)
app.include_router(member_router)
app.include_router(admin_router)


@app.get("/", tags=["Santé"])
def root():
    return {
        "message": "API Anciens Élèves de Siguiri 2012 opérationnelle",
        "docs": "/docs",
    }
