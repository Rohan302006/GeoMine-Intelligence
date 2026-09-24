import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

logger = logging.getLogger("coal_intelligence.database")

from app.core.config import settings

db_url = settings.DATABASE_URL
# Normalize postgres:// scheme commonly returned by Neon and other cloud providers
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# Test Postgres connection if specified, fallback to SQLite
engine = None
try:
    if db_url and db_url.startswith("postgresql"):
        engine = create_engine(db_url, pool_pre_ping=True, pool_recycle=300)
        # Test connection
        with engine.connect() as conn:
            logger.info("Connected to PostgreSQL / Neon DB successfully.")
    else:
        engine = create_engine(db_url, connect_args={"check_same_thread": False} if "sqlite" in db_url else {})
except Exception as e:
    logger.warning(f"Failed to connect to primary DB ({db_url}): {e}. Falling back to SQLite local database.")
    sqlite_fallback_path = os.path.join(settings.BASE_DIR, "coal_intelligence.db")
    engine = create_engine(f"sqlite:///{sqlite_fallback_path}", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
