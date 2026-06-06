import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import Base, engine
from routes.auth_routes import router as auth_router
from routes.member_routes import router as member_router
from config import settings

Base.metadata.create_all(bind=engine)

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


@app.get("/", tags=["Santé"])
def root():
    return {
        "message": "API Anciens Élèves de Siguiri 2012 opérationnelle",
        "docs": "/docs",
    }
