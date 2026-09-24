from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import AuditLog
from app.schemas.schemas import AuditLogItem

router = APIRouter(prefix="/audit", tags=["Audit Logs"])

@router.get("", response_model=List[AuditLogItem])
def get_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(100).all()
    if not logs:
        # Pre-seeded audit logs for SIH demonstration
        return [
            {
                "id": 1,
                "user_name": "Executive Officer",
                "action": "PARLIAMENTARY_QUERY_GENERATED",
                "entity": "Parliamentary Question",
                "entity_id": "LS-Q2841",
                "details": "Generated official Lok Sabha Unstarred reply with 3-year subsidiary production annexure.",
                "timestamp": "2026-09-15T10:42:00"
            },
            {
                "id": 2,
                "user_name": "Data Analyst",
                "action": "VALIDATION_ANOMALY_FLAGGED",
                "entity": "ValidationResult",
                "entity_id": "ANOM-01",
                "details": "Subtotal mismatch detected between unverified subsidiary draft and CIL total.",
                "timestamp": "2026-09-15T09:15:00"
            },
            {
                "id": 3,
                "user_name": "System Automated Pipeline",
                "action": "DOCUMENT_INGESTION_COMPLETED",
                "entity": "Document",
                "entity_id": "DOC-102",
                "details": "Ingested Coal Directory of India 2024-25 Chapter 3. Extracted 8 tabular statements.",
                "timestamp": "2026-09-15T08:30:00"
            },
            {
                "id": 4,
                "user_name": "Admin Officer",
                "action": "SECURITY_LOGIN_SUCCESS",
                "entity": "UserSession",
                "entity_id": "USR-01",
                "details": "JWT session established from CMPDI intranet workstation.",
                "timestamp": "2026-09-15T08:00:00"
            }
        ]
    return logs
