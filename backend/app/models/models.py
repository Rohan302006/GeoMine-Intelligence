from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship

from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="Officer")  # Admin, Analyst, Officer, Viewer
    created_at = Column(DateTime, default=datetime.utcnow)
    
    reports = relationship("GeneratedReport", back_populates="creator")
    queries = relationship("QueryHistory", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    document_type = Column(String(50), nullable=False)  # PDF, Scanned PDF, Excel, CSV, DOCX
    source = Column(String(255), default="Ministry of Coal")
    source_url = Column(String(500), nullable=True)
    upload_date = Column(DateTime, default=datetime.utcnow)
    processing_status = Column(String(50), default="Uploaded")  # Uploaded, Processing, OCR Completed, Extracted, Validated, Needs Review, Failed
    page_count = Column(Integer, default=1)
    checksum = Column(String(64), nullable=True)
    is_demo_data = Column(Boolean, default=False)
    file_path = Column(String(500), nullable=True)
    
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")
    extractions = relationship("ExtractionRecord", back_populates="document", cascade="all, delete-orphan")
    staging_records = relationship("StagingRecord", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    page_number = Column(Integer, default=1)
    text = Column(Text, nullable=False)
    embedding = Column(Text, nullable=True)  # JSON serialized vector embedding or string
    chunk_metadata = Column(Text, nullable=True)  # JSON metadata (headings, tables)
    
    document = relationship("Document", back_populates="chunks")

class CoalProduction(Base):
    __tablename__ = "coal_production"
    
    id = Column(Integer, primary_key=True, index=True)
    year = Column(String(20), index=True, nullable=False)  # e.g., '2024-25'
    company = Column(String(100), default="Coal India Limited (CIL)", index=True)
    subsidiary = Column(String(50), index=True, nullable=False)  # ECL, BCCL, CCL, NCL, WCL, SECL, MCL, etc.
    coal_type = Column(String(50), default="Non-Coking")  # Coking, Non-Coking
    production_mt = Column(Float, nullable=False)  # Million Tonnes
    target_mt = Column(Float, nullable=True)
    growth_percent = Column(Float, nullable=True)
    source_document_id = Column(Integer, ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    is_demo_data = Column(Boolean, default=False)
    
    __table_args__ = (
        Index("idx_prod_year_sub", "year", "subsidiary"),
    )

class Dispatch(Base):
    __tablename__ = "dispatch"
    
    id = Column(Integer, primary_key=True, index=True)
    year = Column(String(20), index=True, nullable=False)
    company = Column(String(100), default="Coal India Limited (CIL)")
    subsidiary = Column(String(50), default="Total CIL")
    coal_type = Column(String(50), default="Non-Coking")
    sector = Column(String(100), default="Power Utility")  # Power, Steel, Cement, Captive, Others
    dispatch_mt = Column(Float, nullable=False)
    source_document_id = Column(Integer, ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    is_demo_data = Column(Boolean, default=False)

class CoalResource(Base):
    __tablename__ = "coal_resources"
    
    id = Column(Integer, primary_key=True, index=True)
    year = Column(String(20), index=True, nullable=False)
    state = Column(String(100), index=True, nullable=False)  # Jharkhand, Odisha, Chhattisgarh, etc.
    measured = Column(Float, default=0.0)
    indicated = Column(Float, default=0.0)
    inferred = Column(Float, default=0.0)
    total = Column(Float, nullable=False)
    source_document_id = Column(Integer, ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    is_demo_data = Column(Boolean, default=False)

class StagingRecord(Base):
    __tablename__ = "staging_records"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    raw_data = Column(Text, nullable=False)  # JSON of extracted table/row
    normalized_data = Column(Text, nullable=True)  # JSON normalized
    status = Column(String(50), default="Staged")  # Staged, Validated, Approved, Rejected
    validation_errors = Column(Text, nullable=True)  # JSON list of errors
    
    document = relationship("Document", back_populates="staging_records")

class ExtractionRecord(Base):
    __tablename__ = "extraction_records"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    field_name = Column(String(100), nullable=False)
    extracted_value = Column(String(255), nullable=False)
    confidence = Column(Float, default=95.0)  # Percentage 0 - 100
    extraction_method = Column(String(50), default="PDF Table Extraction")  # OCR, Table, Text
    validation_status = Column(String(50), default="Pending")  # Validated, Flagged, Needs Review
    
    document = relationship("Document", back_populates="extractions")
    validation_results = relationship("ValidationResult", back_populates="extraction_record", cascade="all, delete-orphan")

class ValidationResult(Base):
    __tablename__ = "validation_results"
    
    id = Column(Integer, primary_key=True, index=True)
    record_id = Column(Integer, ForeignKey("extraction_records.id", ondelete="CASCADE"), nullable=True)
    validation_type = Column(String(100), nullable=False)  # Subtotal Inconsistency, Anomaly, Range, Unit Mismatch
    severity = Column(String(20), default="Medium")  # Low, Medium, High, Critical
    expected_value = Column(String(100), nullable=True)
    actual_value = Column(String(100), nullable=True)
    message = Column(Text, nullable=False)
    status = Column(String(50), default="Active")  # Active, Resolved, Dismissed
    created_at = Column(DateTime, default=datetime.utcnow)
    
    extraction_record = relationship("ExtractionRecord", back_populates="validation_results")

class QueryHistory(Base):
    __tablename__ = "queries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    confidence = Column(Float, default=98.0)
    query_type = Column(String(50), default="Hybrid")  # SQL, Semantic, Hybrid
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="queries")
    sources = relationship("QuerySource", back_populates="query", cascade="all, delete-orphan")

class QuerySource(Base):
    __tablename__ = "query_sources"
    
    id = Column(Integer, primary_key=True, index=True)
    query_id = Column(Integer, ForeignKey("queries.id", ondelete="CASCADE"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    document_name = Column(String(255), nullable=True)
    page_number = Column(Integer, default=1)
    table_name = Column(String(100), nullable=True)
    evidence = Column(Text, nullable=True)
    confidence = Column(Float, default=95.0)
    
    query = relationship("QueryHistory", back_populates="sources")

class GeneratedReport(Base):
    __tablename__ = "generated_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    report_type = Column(String(100), nullable=False)  # Production, Subsidiary, Parliamentary, Resource, Custom
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    file_path = Column(String(500), nullable=False)
    format = Column(String(20), default="PDF")  # PDF, DOCX, Excel
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    creator = relationship("User", back_populates="reports")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    user_name = Column(String(100), default="System")
    action = Column(String(100), nullable=False)
    entity = Column(String(100), nullable=False)
    entity_id = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="audit_logs")
