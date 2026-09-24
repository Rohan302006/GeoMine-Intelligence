from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from app.models.models import AuditLog

class AuditService:
    def log_action(
        self,
        db: Session,
        action: str,
        entity: str,
        entity_id: Optional[str] = None,
        user_name: str = "Executive Officer",
        user_id: Optional[int] = 2,
        details: Optional[str] = None
    ):
        log_entry = AuditLog(
            user_id=user_id,
            user_name=user_name,
            action=action,
            entity=entity,
            entity_id=str(entity_id) if entity_id else None,
            details=details,
            timestamp=datetime.utcnow()
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        return log_entry

audit_service = AuditService()