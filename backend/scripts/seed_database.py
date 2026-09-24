import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, engine, Base
from app.core.security import hash_password
from app.models.models import User, ValidationResult, ExtractionRecord, GeneratedReport, AuditLog, Document
from app.reporting.report_generator import report_generator
from scripts.import_ministry_data import import_ministry_data

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # 1. First import Ministry of Coal baseline datasets
    import_ministry_data()
    
    print("Seeding users...")
    # Seed default users
    users_data = [
        {"name": "System Administrator", "email": "admin@geomine.ai", "role": "Admin"},
        {"name": "Executive Officer", "email": "officer@geomine.ai", "role": "Officer"},
        {"name": "Data Analyst", "email": "analyst@geomine.ai", "role": "Analyst"},
        {"name": "Public Viewer", "email": "viewer@geomine.ai", "role": "Viewer"}
    ]
    for u in users_data:
        existing = db.query(User).filter(User.email == u["email"]).first()
        if existing:
            existing.name = u["name"]
            existing.password_hash = hash_password("DemoPass#2026")
            existing.role = u["role"]
        else:
            user = User(
                name=u["name"],
                email=u["email"],
                password_hash=hash_password("DemoPass#2026"),
                role=u["role"]
            )
            db.add(user)
    db.commit()

    # 2. Seed Validation Anomalies for demonstration
    print("Seeding validation anomalies...")
    doc = db.query(Document).first()
    doc_id = doc.id if doc else 1
    
    anomalies = [
        {
            "validation_type": "Subtotal Inconsistency",
            "severity": "Critical",
            "expected_value": "781.06 MT (Reported CIL Total)",
            "actual_value": "795.12 MT (Sum of Subsidiaries)",
            "message": "Mathematical discrepancy detected in unverified draft: Sum of reported subsidiary outputs exceeds stated consolidated CIL total by 14.06 MT.",
            "status": "Active"
        },
        {
            "validation_type": "Target Deviation Anomaly",
            "severity": "Medium",
            "expected_value": "84.00 MT (Target)",
            "actual_value": "114.20 MT (+35.9%)",
            "message": "CCL raw coal extraction exceeded quarterly target by >35%, requiring manual verification of weighbridge logs.",
            "status": "Active"
        },
        {
            "validation_type": "Financial Year Context Mismatch",
            "severity": "Medium",
            "expected_value": "2024-25",
            "actual_value": "2023-24",
            "message": "Uploaded monthly bulletin has header labeled FY 2024-25 but embedded dispatch annexure corresponds to FY 2023-24.",
            "status": "Active"
        }
    ]
    for anom in anomalies:
        existing_anom = db.query(ValidationResult).filter(ValidationResult.message == anom["message"]).first()
        if not existing_anom:
            vr = ValidationResult(
                validation_type=anom["validation_type"],
                severity=anom["severity"],
                expected_value=anom["expected_value"],
                actual_value=anom["actual_value"],
                message=anom["message"],
                status=anom["status"]
            )
            db.add(vr)
    db.commit()

    # 3. Seed pre-generated demonstration report
    print("Generating demo PDF report...")
    pdf_path = report_generator.generate_pdf_report(
        title="Consolidated Annual Coal Production & Geological Audit Report 2024-25",
        report_type="Executive Summary",
        summary_text="In FY 2024-25, India achieved domestic coal production of 1047.52 MT, surpassing the 1-Billion Tonne target. Coal India Limited contributed 781.06 MT (~75%), led by MCL (218.31 MT) and SECL (176.29 MT).",
        table_data=[
            ["Subsidiary / Agency", "Production (MT)", "Target (MT)", "Achievement (%)"],
            ["Mahanadi Coalfields (MCL)", "218.31", "215.00", "101.5%"],
            ["South Eastern Coalfields (SECL)", "176.29", "180.00", "97.9%"],
            ["Northern Coalfields (NCL)", "140.50", "142.00", "98.9%"],
            ["Central Coalfields (CCL)", "82.26", "84.00", "97.9%"],
            ["Western Coalfields (WCL)", "63.03", "65.00", "96.9%"],
            ["Eastern Coalfields (ECL)", "52.08", "53.00", "98.2%"],
            ["Bharat Coking Coal (BCCL)", "35.52", "37.00", "96.0%"],
            ["Total Coal India Ltd (CIL)", "781.06", "780.00", "100.1%"]
        ],
        sources=[
            "National Coal Directory & Statistics Compendium 2024-25",
            "Coal Statistics Organisation Monthly Bulletin"
        ]
    )
    
    existing_rep = db.query(GeneratedReport).filter(GeneratedReport.title.like("%Consolidated Annual%")).first()
    if not existing_rep:
        rep = GeneratedReport(
            title="Consolidated Annual Coal Production & Geological Audit Report 2024-25",
            report_type="Executive Summary",
            file_path=pdf_path,
            format="PDF",
            summary="Annual performance overview covering CIL and subsidiary performance."
        )
        db.add(rep)
    db.commit()

    print("Database seeding completed successfully!")
    db.close()

if __name__ == "__main__":
    seed_database()
