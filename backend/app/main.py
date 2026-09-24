import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import engine, Base
import app.models.models as models

# Initialize database tables
Base.metadata.create_all(bind=engine)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("coal_intelligence")

app = FastAPI(
    title="SIH26023 — AI-Powered Coal & Geological Intelligence Platform",
    description="AI-powered coal and geological intelligence prototype solution developed for Smart India Hackathon 2026 (PS ID: SIH26023).",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.documents import router as documents_router
from app.api.validation import router as validation_router
from app.api.coal import router as coal_router
from app.api.ai import router as ai_router
from app.api.reports import router as reports_router
from app.api.topics import router as topics_router
from app.api.catalog import router as catalog_router
from app.api.audit import router as audit_router

app.include_router(auth_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(documents_router, prefix="/api")
app.include_router(validation_router, prefix="/api")
app.include_router(coal_router, prefix="/api")
app.include_router(ai_router, prefix="/api")
app.include_router(reports_router, prefix="/api")
app.include_router(topics_router, prefix="/api")
app.include_router(catalog_router, prefix="/api")
app.include_router(audit_router, prefix="/api")

@app.on_event("startup")
def on_startup():
    try:
        from app.core.database import SessionLocal
        from app.models.models import User
        db = SessionLocal()
        user_count = db.query(User).count()
        db.close()
        if user_count == 0:
            logger.info("Fresh database detected (0 users). Auto-seeding initial Ministry of Coal datasets & default users...")
            from scripts.seed_database import seed_database
            seed_database()
            logger.info("Database auto-seeding completed.")
        else:
            logger.info(f"Database ready: detected {user_count} registered users.")
    except Exception as e:
        logger.warning(f"Database auto-seeding check: {e}")

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "CMPDI / CIL AI-Powered Geological & Mining Intelligence Platform",
        "version": "1.0.0",
        "disclaimer": "Prototype Dataset: Publicly available Ministry of Coal statistics used for demonstration. Production deployment can ingest authorized CMPDI/CIL internal documents.",
        "api_docs": "/docs"
    }

@app.get("/api/health")
def health():
    return {"status": "healthy", "database": "connected"}

