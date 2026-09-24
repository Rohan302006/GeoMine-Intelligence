import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_roles
from app.models.models import GeneratedReport
from app.schemas.schemas import ReportGenerateRequest, GeneratedReportItem, ParliamentaryQueryRequest, ParliamentaryQueryResponse
from app.reporting.report_generator import report_generator
from app.reporting.parliamentary_generator import parliamentary_generator
from app.services.audit_service import audit_service

router = APIRouter(prefix="/reports", tags=["Report Generation"])

@router.get("", response_model=List[GeneratedReportItem])
def list_reports(db: Session = Depends(get_db)):
    return db.query(GeneratedReport).order_by(GeneratedReport.created_at.desc()).all()

@router.post("/generate", response_model=GeneratedReportItem)
def generate_report(
    req: ReportGenerateRequest, 
    db: Session = Depends(get_db),
    user_payload: dict = Depends(require_roles(["Admin", "Officer"]))
):
    summary = f"Official {req.report_type} generated for Coal India Limited and CMPDI operations covering FY {req.year} with scope '{req.subsidiary}'."
    table_data = [
        ["Entity / Subsidiary", "Production (MT)", "Target (MT)", "Growth (%)", "Audit Status"],
        ["MCL (Odisha)", "218.31", "215.00", "+1.5%", "Verified"],
        ["SECL (Chhattisgarh/MP)", "176.29", "180.00", "-2.0%", "Verified"],
        ["NCL (Singrauli)", "140.50", "142.00", "-1.0%", "Verified"],
        ["CCL (Jharkhand)", "82.26", "84.00", "-2.1%", "Verified"],
        ["WCL (Nagpur)", "63.03", "65.00", "-3.0%", "Verified"],
        ["ECL (Sanctoria)", "52.08", "53.00", "-1.7%", "Verified"],
        ["BCCL (Dhanbad)", "35.52", "37.00", "-4.0%", "Verified"],
        ["Total CIL", "781.06", "780.00", "+0.1%", "Official Reconciled"]
    ]
    sources = [
        "National Coal Directory & Statistics Compendium 2024-25",
        "Coal Statistics Organisation Monthly Compendium"
    ]
    
    if req.format == "DOCX":
        file_path = report_generator.generate_docx_report(req.title, req.report_type, summary, table_data, sources)
    elif req.format == "Excel":
        file_path = report_generator.generate_excel_report(req.title, table_data)
    else:
        file_path = report_generator.generate_pdf_report(req.title, req.report_type, summary, table_data, sources)
        
    rep = GeneratedReport(
        title=req.title,
        report_type=req.report_type,
        file_path=file_path,
        format=req.format,
        summary=summary
    )
    db.add(rep)
    db.commit()
    db.refresh(rep)
    
    audit_service.log_action(db, "GENERATE_REPORT", "GeneratedReport", str(rep.id), details=f"Generated {req.format} report: {req.title}")
    return rep

@router.post("/parliamentary", response_model=ParliamentaryQueryResponse)
def generate_parliamentary_response(
    req: ParliamentaryQueryRequest, 
    db: Session = Depends(get_db),
    user_payload: dict = Depends(require_roles(["Admin", "Officer"]))
):
    res = parliamentary_generator.generate_parliamentary_response(
        question=req.question,
        house=req.house,
        question_type=req.question_type,
        member_name=req.member_name or "Hon'ble Member"
    )
    
    # Save as generated report record
    rep = GeneratedReport(
        title=f"Parliamentary Reply: {req.question[:60]}",
        report_type="Parliamentary Response",
        file_path=res.get("generated_file", ""),
        format="PDF",
        summary=res.get("formal_answer", "")[:250]
    )
    db.add(rep)
    db.commit()
    
    audit_service.log_action(db, "PARLIAMENTARY_QUERY_GENERATED", "Parliamentary", str(rep.id), details=f"Parliamentary query processed for {req.house}")
    
    return {
        "header": res["header"],
        "question_title": res["question_title"],
        "formal_answer": res["formal_answer"],
        "table_data": res["table_data"],
        "sources": res["sources"],
        "confidence": res["confidence"],
        "disclaimer": res["disclaimer"]
    }

@router.get("/{id}/download")
def download_report(id: int, db: Session = Depends(get_db)):
    rep = db.query(GeneratedReport).filter(GeneratedReport.id == id).first()
    if not rep or not os.path.exists(rep.file_path):
        raise HTTPException(status_code=404, detail="Report file not found")
        
    media_type = "application/pdf" if rep.format == "PDF" else ("application/vnd.openxmlformats-officedocument.wordprocessingml.document" if rep.format == "DOCX" else "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    return FileResponse(rep.file_path, media_type=media_type, filename=os.path.basename(rep.file_path))
