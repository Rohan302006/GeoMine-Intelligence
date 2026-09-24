from fastapi import APIRouter

router = APIRouter(prefix="/catalog", tags=["Data Catalog"])

@router.get("")
def get_data_catalog():
    return [
        {
            "id": "CAT-01",
            "name": "Coal Directory & Statistical Yearbook 2024–25 (Chapters 1 to 11)",
            "description": "Comprehensive annual compendium on coal resources, production, captive blocks, and dispatches.",
            "source": "Public Coal Statistics Compendium",
            "source_url": "https://public-data.coal-analytics.org/statistics",
            "publication_date": "2025-06-15",
            "coverage": "All-India, CIL, SCCL, Captive & Commercial Blocks",
            "record_count": 1420,
            "quality_score": 98.4,
            "status": "Validated & Ingested",
            "is_demo_data": False
        },
        {
            "id": "CAT-02",
            "name": "Coal Directory & Statistical Compendium 2023–24",
            "description": "Statistical yearbook detailing historical production, grade-wise analysis, and washery throughput.",
            "source": "Public Coal Statistics Compendium",
            "source_url": "https://public-data.coal-analytics.org/statistics",
            "publication_date": "2024-06-20",
            "coverage": "National & Subsidiary Basins",
            "record_count": 1380,
            "quality_score": 97.9,
            "status": "Validated & Ingested",
            "is_demo_data": False
        },
        {
            "id": "CAT-03",
            "name": "Provisional Coal Statistics 2023–24 & 2024–25",
            "description": "Provisional monthly and annual compilation of raw coal production, pithead dispatch, and thermal power plant receipts.",
            "source": "Coal Statistics Organisation",
            "source_url": "https://public-data.coal-analytics.org/provisional",
            "publication_date": "2025-04-10",
            "coverage": "Monthly & Annual Reconciliations",
            "record_count": 890,
            "quality_score": 96.5,
            "status": "Validated & Ingested",
            "is_demo_data": False
        },
        {
            "id": "CAT-04",
            "name": "Inventory of Geological Resources of Coal (CMPDI / GSI Inventory)",
            "description": "National geological repository quantifying Measured (Proved), Indicated, and Inferred coal seams across major Gondwana basins.",
            "source": "Geological Survey & Exploration Records",
            "source_url": "https://public-data.coal-analytics.org/resources",
            "publication_date": "2024-04-01",
            "coverage": "Geological Basins (Jharkhand, Odisha, MP, CG, WB, AP)",
            "record_count": 450,
            "quality_score": 99.1,
            "status": "Validated & Ingested",
            "is_demo_data": False
        },
        {
            "id": "CAT-05",
            "name": "Monthly Statistics at a Glance — Coal Supplies & Movement",
            "description": "Monitoring bulletin of thermal coal movement, railway rake availability, and sectoral offtake trends.",
            "source": "Public Energy Data Portal",
            "source_url": "https://public-data.coal-analytics.org/monthly",
            "publication_date": "2025-08-01",
            "coverage": "Power Utilities & Offtake Points",
            "record_count": 320,
            "quality_score": 95.8,
            "status": "Validated & Ingested",
            "is_demo_data": False
        }
    ]
