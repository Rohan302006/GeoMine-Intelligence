import os

class Settings:
    PROJECT_NAME: str = "SIH26023 — AI-Powered Geological & Mining Reporting Solution"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "sih26023_cmpdi_cil_secure_production_secret_key_2026")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./coal_intelligence.db")
    
    # AI Providers
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DEFAULT_AI_PROVIDER: str = os.getenv("DEFAULT_AI_PROVIDER", "local_fallback")
    
    # Storage Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    DATA_DIR: str = os.path.join(BASE_DIR, "data")
    UPLOAD_DIR: str = os.path.join(DATA_DIR, "raw")
    PROCESSED_DIR: str = os.path.join(DATA_DIR, "processed")
    DEMO_DIR: str = os.path.join(DATA_DIR, "demo")
    REPORTS_DIR: str = os.path.join(DATA_DIR, "generated_reports")
    
    # CORS
    @property
    def CORS_ORIGINS(self) -> list:
        origins_env = os.getenv("CORS_ORIGINS", "")
        if origins_env:
            return [orig.strip() for orig in origins_env.split(",") if orig.strip()]
        return [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:8000",
            "http://127.0.0.1:8000"
        ]

settings = Settings()

# Ensure directories exist
for folder in [settings.DATA_DIR, settings.UPLOAD_DIR, settings.PROCESSED_DIR, settings.DEMO_DIR, settings.REPORTS_DIR]:
    os.makedirs(folder, exist_ok=True)
