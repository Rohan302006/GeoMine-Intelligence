from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

# ----------------- Auth Schemas -----------------
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str = "Officer"

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ----------------- Document Schemas -----------------
class DocumentResponse(BaseModel):
    id: int
    filename: str
    document_type: str
    source: str
    source_url: Optional[str] = None
    upload_date: datetime
    processing_status: str
    page_count: int
    is_demo_data: bool
    extracted_records_count: Optional[int] = 0
    confidence: Optional[float] = 96.5

    class Config:
        from_attributes = True

class DocumentChunkResponse(BaseModel):
    id: int
    page_number: int
    text: str

    class Config:
        from_attributes = True

class DocumentDetailResponse(DocumentResponse):
    chunks: List[DocumentChunkResponse] = []

# ----------------- Coal Statistics -----------------
class CoalProductionItem(BaseModel):
    id: int
    year: str
    company: str
    subsidiary: str
    coal_type: str
    production_mt: float
    target_mt: Optional[float] = None
    growth_percent: Optional[float] = None
    source_document_id: Optional[int] = None
    is_demo_data: bool

    class Config:
        from_attributes = True

class DispatchItem(BaseModel):
    id: int
    year: str
    company: str
    subsidiary: str
    coal_type: str
    sector: str
    dispatch_mt: float
    is_demo_data: bool

    class Config:
        from_attributes = True

class CoalResourceItem(BaseModel):
    id: int
    year: str
    state: str
    measured: float
    indicated: float
    inferred: float
    total: float

    class Config:
        from_attributes = True

class DashboardSummaryResponse(BaseModel):
    total_coal_production_mt: float
    cil_production_mt: float
    total_coal_resources_bt: float
    total_dispatch_mt: float
    total_documents: int
    processed_documents: int
    data_records_count: int
    queries_answered: int
    reports_generated: int
    data_quality_score: float
    disclaimer: str

# ----------------- Validation & Staging -----------------
class ValidationResultResponse(BaseModel):
    id: int
    record_id: Optional[int] = None
    validation_type: str
    severity: str  # Low, Medium, High, Critical
    expected_value: Optional[str] = None
    actual_value: Optional[str] = None
    message: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class StagingRecordResponse(BaseModel):
    id: int
    document_id: int
    raw_data: str
    normalized_data: Optional[str] = None
    status: str
    validation_errors: Optional[str] = None

    class Config:
        from_attributes = True

class DataQualityScorecard(BaseModel):
    overall_score: float
    completeness: float
    accuracy: float
    consistency: float
    duplicate_free: float
    active_anomalies_count: int

# ----------------- AI Query & Response -----------------
class AIQueryRequest(BaseModel):
    question: str
    user_id: Optional[int] = None

class QuerySourceItem(BaseModel):
    document_name: str
    page_number: int
    table_name: Optional[str] = None
    evidence: str
    confidence: float

class AIQueryResponse(BaseModel):
    question: str
    answer: str
    key_figures: List[Dict[str, Any]] = []
    confidence: float
    sources: List[QuerySourceItem] = []
    query_type: str = "Hybrid"
    evidence_snippet: Optional[str] = None
    disclaimer: str = "This platform is a prototype solution developed for the Smart India Hackathon 2026 (PS ID: SIH26023). It is not an official portal of the Ministry of Coal or CMPDI/CIL."

# ----------------- Parliamentary & Report Generator -----------------
class ParliamentaryQueryRequest(BaseModel):
    question: str
    ministry: str = "Mineral Analytics Division"
    house: str = "Lok Sabha"  # Lok Sabha, Rajya Sabha
    question_type: str = "Unstarred"  # Starred, Unstarred
    member_name: Optional[str] = "Hon'ble Member"

class ParliamentaryQueryResponse(BaseModel):
    header: str
    question_title: str
    formal_answer: str
    table_data: List[Dict[str, Any]] = []
    sources: List[str] = []
    confidence: float
    disclaimer: str

class ReportGenerateRequest(BaseModel):
    report_type: str  # Coal Production Report, Subsidiary Performance, Coal Dispatch, Parliamentary Response, Executive Summary
    title: str
    year: Optional[str] = "2024-25"
    subsidiary: Optional[str] = "All"
    format: str = "PDF"  # PDF, DOCX, Excel

class GeneratedReportItem(BaseModel):
    id: int
    title: str
    report_type: str
    file_path: str
    format: str
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Topics & Word Cloud -----------------
class WordCloudItem(BaseModel):
    text: str
    value: int

class TopicDistributionItem(BaseModel):
    topic: str
    count: int
    percentage: float
    sentiment: str = "Neutral"

# ----------------- Audit Log -----------------
class AuditLogItem(BaseModel):
    id: int
    user_name: str
    action: str
    entity: str
    entity_id: Optional[str] = None
    details: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True
