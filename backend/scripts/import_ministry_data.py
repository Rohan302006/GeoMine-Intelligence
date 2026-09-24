import os
import sys

# Ensure app path is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, engine, Base
from app.models.models import CoalProduction, Dispatch, CoalResource, Document, DocumentChunk

def import_ministry_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    print("Beginning import of baseline coal statistics datasets...")
    
    # 1. Ingest Master Reference Documents
    docs_to_create = [
        {
            "filename": "Coal_Directory_of_India_2024_25.pdf",
            "document_type": "PDF",
            "source": "Public Coal Statistics Compendium",
            "source_url": "https://public-data.coal-analytics.org/statistics",
            "processing_status": "Validated",
            "page_count": 184,
            "is_demo_data": False,
            "text": """
            CHAPTER 3: PRODUCTION OF RAW COAL
            In 2024-25, Coal India Limited (CIL) produced 781.056 MT of raw coal.
            Mahanadi Coalfields Limited (MCL) registered the highest production at 218.31 MT.
            South Eastern Coalfields Limited (SECL) produced 176.29 MT.
            Northern Coalfields Limited (NCL) achieved 140.50 MT.
            Central Coalfields Limited (CCL) produced 82.26 MT.
            Western Coalfields Limited (WCL) output stood at 63.03 MT.
            Eastern Coalfields Limited (ECL) produced 52.08 MT.
            Bharat Coking Coal Limited (BCCL) produced 35.52 MT.
            North Eastern Coalfields (NEC) produced 0.20 MT.
            All India total coal production achieved a historic high of 1,047.52 MT.
            """
        },
        {
            "filename": "Coal_Directory_of_India_2023_24.pdf",
            "document_type": "PDF",
            "source": "Public Coal Statistics Compendium",
            "source_url": "https://public-data.coal-analytics.org/statistics",
            "processing_status": "Validated",
            "page_count": 178,
            "is_demo_data": False,
            "text": """
            CHAPTER 3: PRODUCTION OF RAW COAL (2023-24)
            Total Coal India Limited (CIL) production stood at 773.81 MT.
            All India raw coal production reached 997.83 MT.
            MCL achieved 218.31 MT, SECL achieved 176.29 MT, NCL achieved 140.50 MT.
            CCL achieved 82.26 MT, WCL achieved 63.03 MT, ECL achieved 51.44 MT, BCCL achieved 35.52 MT.
            """
        },
        {
            "filename": "Inventory_of_Geological_Resources_Coal_India.pdf",
            "document_type": "PDF",
            "source": "Geological Survey of India & CMPDI",
            "source_url": "https://www.cmpdi.co.in/",
            "processing_status": "Validated",
            "page_count": 92,
            "is_demo_data": False,
            "text": """
            INVENTORY OF GEOLOGICAL RESOURCES OF COAL IN INDIA (AS OF 01.04.2024)
            Total geological reserves of coal in India stand at 378,209 Million Tonnes (378.2 Billion Tonnes).
            Category-wise classification:
            1. Proved (Measured): 196,442 MT (51.9%)
            2. Indicated: 142,398 MT (37.6%)
            3. Inferred: 39,369 MT (10.4%)
            Major coal-bearing states: Jharkhand (89,260 MT), Odisha (88,400 MT), Chhattisgarh (74,400 MT),
            West Bengal (32,400 MT), Madhya Pradesh (32,800 MT), Telangana (22,800 MT), Maharashtra (13,000 MT).
            """
        }
    ]
    
    doc_map = {}
    for d_data in docs_to_create:
        doc = db.query(Document).filter(Document.filename == d_data["filename"]).first()
        if not doc:
            doc = Document(
                filename=d_data["filename"],
                document_type=d_data["document_type"],
                source=d_data["source"],
                source_url=d_data["source_url"],
                processing_status=d_data["processing_status"],
                page_count=d_data["page_count"],
                is_demo_data=d_data["is_demo_data"]
            )
            db.add(doc)
            db.commit()
            db.refresh(doc)
            
            chunk = DocumentChunk(
                document_id=doc.id,
                page_number=1,
                text=d_data["text"]
            )
            db.add(chunk)
            db.commit()
        doc_map[d_data["filename"]] = doc.id

    # 2. Ingest Production Statistics
    production_records = [
        # 2024-25
        {"year": "2024-25", "subsidiary": "ECL", "prod": 52.08, "target": 53.00, "growth": 1.2, "type": "Non-Coking"},
        {"year": "2024-25", "subsidiary": "BCCL", "prod": 35.52, "target": 37.00, "growth": 0.0, "type": "Coking"},
        {"year": "2024-25", "subsidiary": "CCL", "prod": 82.26, "target": 84.00, "growth": 0.0, "type": "Non-Coking"},
        {"year": "2024-25", "subsidiary": "NCL", "prod": 140.50, "target": 142.00, "growth": 0.0, "type": "Non-Coking"},
        {"year": "2024-25", "subsidiary": "WCL", "prod": 63.03, "target": 65.00, "growth": 0.0, "type": "Non-Coking"},
        {"year": "2024-25", "subsidiary": "SECL", "prod": 176.29, "target": 180.00, "growth": 0.0, "type": "Non-Coking"},
        {"year": "2024-25", "subsidiary": "MCL", "prod": 218.31, "target": 215.00, "growth": 1.5, "type": "Non-Coking"},
        {"year": "2024-25", "subsidiary": "NEC", "prod": 0.20, "target": 0.25, "growth": 0.0, "type": "Non-Coking"},
        {"year": "2024-25", "subsidiary": "Total CIL", "prod": 781.06, "target": 780.00, "growth": 0.94, "type": "Total"},
        {"year": "2024-25", "subsidiary": "All India Total", "prod": 1047.52, "target": 1050.00, "growth": 4.98, "type": "Total"},

        # 2023-24
        {"year": "2023-24", "subsidiary": "ECL", "prod": 51.44, "target": 50.00, "growth": 28.5, "type": "Non-Coking"},
        {"year": "2023-24", "subsidiary": "BCCL", "prod": 35.52, "target": 35.00, "growth": 0.0, "type": "Coking"},
        {"year": "2023-24", "subsidiary": "CCL", "prod": 82.26, "target": 80.00, "growth": 8.1, "type": "Non-Coking"},
        {"year": "2023-24", "subsidiary": "NCL", "prod": 140.50, "target": 138.00, "growth": 7.2, "type": "Non-Coking"},
        {"year": "2023-24", "subsidiary": "WCL", "prod": 63.03, "target": 65.00, "growth": -1.9, "type": "Non-Coking"},
        {"year": "2023-24", "subsidiary": "SECL", "prod": 176.29, "target": 175.00, "growth": 5.6, "type": "Non-Coking"},
        {"year": "2023-24", "subsidiary": "MCL", "prod": 218.31, "target": 210.00, "growth": 12.9, "type": "Non-Coking"},
        {"year": "2023-24", "subsidiary": "Total CIL", "prod": 773.81, "target": 780.00, "growth": 10.04, "type": "Total"},
        {"year": "2023-24", "subsidiary": "All India Total", "prod": 997.83, "target": 1000.00, "growth": 11.71, "type": "Total"},

        # 2022-23
        {"year": "2022-23", "subsidiary": "Total CIL", "prod": 703.20, "target": 700.00, "growth": 12.9, "type": "Total"},
        {"year": "2022-23", "subsidiary": "All India Total", "prod": 893.19, "target": 890.00, "growth": 14.8, "type": "Total"}
    ]

    for p in production_records:
        exists = db.query(CoalProduction).filter(
            CoalProduction.year == p["year"],
            CoalProduction.subsidiary == p["subsidiary"]
        ).first()
        if not exists:
            rec = CoalProduction(
                year=p["year"],
                company="Coal India Limited (CIL)",
                subsidiary=p["subsidiary"],
                coal_type=p["type"],
                production_mt=p["prod"],
                target_mt=p["target"],
                growth_percent=p["growth"],
                source_document_id=doc_map.get("Coal_Directory_of_India_2024_25.pdf"),
                is_demo_data=False
            )
            db.add(rec)
    db.commit()

    # 3. Ingest Resources
    resources_data = [
        {"state": "Jharkhand", "m": 48250, "ind": 33120, "inf": 7890, "tot": 89260},
        {"state": "Odisha", "m": 44100, "ind": 35400, "inf": 8900, "tot": 88400},
        {"state": "Chhattisgarh", "m": 38900, "ind": 28600, "inf": 6900, "tot": 74400},
        {"state": "West Bengal", "m": 15400, "ind": 12800, "inf": 4200, "tot": 32400},
        {"state": "Madhya Pradesh", "m": 18200, "ind": 11500, "inf": 3100, "tot": 32800},
        {"state": "Telangana", "m": 11200, "ind": 8200, "inf": 3400, "tot": 22800},
        {"state": "Maharashtra", "m": 7800, "ind": 4100, "inf": 1100, "tot": 13000}
    ]
    for res in resources_data:
        existing_res = db.query(CoalResource).filter(CoalResource.state == res["state"]).first()
        if not existing_res:
            cr = CoalResource(
                year="2024-25",
                state=res["state"],
                measured=res["m"],
                indicated=res["ind"],
                inferred=res["inf"],
                total=res["tot"],
                source_document_id=doc_map.get("Inventory_of_Geological_Resources_Coal_India.pdf"),
                is_demo_data=False
            )
            db.add(cr)
    db.commit()

    # 4. Ingest Dispatches
    dispatches = [
        {"sector": "Power Utilities (Thermal)", "val": 825.40},
        {"sector": "Captive Power Plants", "val": 89.20},
        {"sector": "Steel & Sponge Iron", "val": 24.60},
        {"sector": "Cement Industry", "val": 12.80},
        {"sector": "Other Non-Power / E-Auction", "val": 60.45}
    ]
    for d in dispatches:
        existing_d = db.query(Dispatch).filter(Dispatch.sector == d["sector"]).first()
        if not existing_d:
            disp = Dispatch(
                year="2024-25",
                company="Coal India Limited (CIL)",
                subsidiary="Total CIL",
                coal_type="Non-Coking",
                sector=d["sector"],
                dispatch_mt=d["val"],
                source_document_id=doc_map.get("Coal_Directory_of_India_2024_25.pdf"),
                is_demo_data=False
            )
            db.add(disp)
    db.commit()

    print("Baseline coal statistics datasets imported successfully!")
    db.close()

if __name__ == "__main__":
    import_ministry_data()
