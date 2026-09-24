from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.schemas import AIQueryRequest, AIQueryResponse
from app.ai.hybrid_query import hybrid_query_engine
from app.models.models import QueryHistory, QuerySource
from app.services.audit_service import audit_service

router = APIRouter(prefix="/ai", tags=["AI Query Engine"])

@router.post("/query", response_model=AIQueryResponse)
def execute_ai_query(query_req: AIQueryRequest, db: Session = Depends(get_db)):
    result = hybrid_query_engine.process_query(db, query_req.question)
    
    # Save in query history
    qh = QueryHistory(
        user_id=query_req.user_id or 1,
        question=query_req.question,
        answer=result.get("answer", ""),
        confidence=result.get("confidence", 95.0),
        query_type=result.get("query_type", "Hybrid")
    )
    db.add(qh)
    db.commit()
    db.refresh(qh)
    
    # Save sources
    for src in result.get("sources", []):
        qs = QuerySource(
            query_id=qh.id,
            document_name=src.get("document_name"),
            page_number=src.get("page_number", 1),
            table_name=src.get("table_name"),
            evidence=src.get("evidence"),
            confidence=src.get("confidence", 95.0)
        )
        db.add(qs)
    db.commit()
    
    audit_service.log_action(db, "AI_QUERY_EXECUTED", "QueryHistory", str(qh.id), details=f"Question: {query_req.question[:60]}...")
    
    return result

@router.get("/sample-questions")
def get_sample_questions():
    return [
        {"id": 1, "category": "Production", "question": "What was CIL's coal production in 2024-25?"},
        {"id": 2, "category": "Subsidiary Analysis", "question": "Which CIL subsidiary produced the most coal?"},
        {"id": 3, "category": "Comparative Analysis", "question": "Compare CCL, SECL and MCL production."},
        {"id": 4, "category": "National Trend", "question": "What was India's total coal production in 2023-24?"},
        {"id": 5, "category": "Growth Trajectory", "question": "Show coal production growth over recent financial years."},
        {"id": 6, "category": "Grade Classification", "question": "What percentage of CIL production was non-coking coal?"},
        {"id": 7, "category": "Geological Inventory", "question": "What is India's total coal resource and its geological breakdown?"},
        {"id": 8, "category": "Supply & Imports", "question": "What were coal imports during recent financial years?"}
    ]
