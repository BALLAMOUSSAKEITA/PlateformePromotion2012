from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def migrate_db():
    """Ajoute les colonnes manquantes sur les bases existantes (SQLite/PostgreSQL)."""
    new_columns = [
        ("school", "VARCHAR(150)"),
        ("profession", "VARCHAR(150)"),
        ("city", "VARCHAR(150)"),
        ("contact_email", "VARCHAR(255)"),
        ("option", "VARCHAR(50)"),
        ("current_activity", "VARCHAR(255)"),
        ("country", "VARCHAR(100)"),
        ("cv_url", "VARCHAR(500)"),
    ]
    with engine.connect() as conn:
        for col_name, col_type in new_columns:
            try:
                # Guillemets obligatoires pour éviter les conflits avec les mots-clés SQL (ex: "option")
                conn.execute(text(f'ALTER TABLE members ADD COLUMN "{col_name}" {col_type}'))
                conn.commit()
            except Exception:
                conn.rollback()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
