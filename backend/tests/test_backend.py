import pytest
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token
from app.utils.normalization import normalize_subsidiary, normalize_unit_to_mt, normalize_financial_year
from app.validation.validation_engine import validation_engine
from app.core.database import SessionLocal
from app.ai.hybrid_query import hybrid_query_engine

def test_auth_and_tokens():
    pwd = "CoalPassword2026"
    h = hash_password(pwd)
    assert verify_password(pwd, h) is True
    assert verify_password("WrongPassword", h) is False
    
    token = create_access_token({"sub": "test@geomine.ai", "role": "Officer"})
    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "test@geomine.ai"
    assert decoded["role"] == "Officer"

def test_normalization():
    # Subsidiary alias normalization
    assert normalize_subsidiary("Coal India Limited") == "Coal India Limited (CIL)"
    assert normalize_subsidiary("CIL") == "Coal India Limited (CIL)"
    assert normalize_subsidiary("Mahanadi Coalfields") == "MCL"
    assert normalize_subsidiary("eastern coalfields limited") == "ECL"
    assert normalize_subsidiary("South Eastern Coalfields") == "SECL"
    
    # Unit normalization to MT
    assert normalize_unit_to_mt(1000000, "tonnes") == 1.0
    assert normalize_unit_to_mt(500000, "thousand tonnes") == 500.0
    assert normalize_unit_to_mt(781.06, "MT") == 781.06
    assert normalize_unit_to_mt(0.378, "billion tonnes") == 378.0
    
    # Financial year normalization
    assert normalize_financial_year("2024-2025") == "2024-25"
    assert normalize_financial_year("FY25") == "2024-25"
    assert normalize_financial_year("2024-25") == "2024-25"

def test_validation_engine():
    # Test subtotal discrepancy detection
    records = [
        {"subsidiary": "ECL", "production_mt": 52.08, "year": "2024-25", "target_mt": 53.0},
        {"subsidiary": "MCL", "production_mt": 218.31, "year": "2024-25", "target_mt": 215.0},
        {"subsidiary": "Total CIL", "production_mt": 781.06, "year": "2024-25", "target_mt": 780.0} # sum of ECL+MCL is only 270.39, discrepancy
    ]
    anomalies = validation_engine.validate_production_records(records, expected_year="2024-25")
    subtotal_anoms = [a for a in anomalies if a["validation_type"] == "Subtotal Inconsistency"]
    assert len(subtotal_anoms) > 0
    assert "Discrepancy" in subtotal_anoms[0]["message"] or "discrepancy" in subtotal_anoms[0]["message"]

    # Test negative number detection
    bad_records = [
        {"subsidiary": "WCL", "production_mt": -15.0, "year": "2024-25"}
    ]
    neg_anoms = validation_engine.validate_production_records(bad_records)
    assert any(a["validation_type"] == "Invalid Value Range" for a in neg_anoms)

def test_hybrid_ai_query():
    db = SessionLocal()
    # Query 1: CIL Production
    res1 = hybrid_query_engine.process_query(db, "What was CIL's coal production in 2024-25?")
    assert "781.06" in res1["answer"]
    assert res1["confidence"] > 95.0
    assert len(res1["sources"]) > 0
    assert "Coal Directory" in res1["sources"][0]["document_name"]

    # Query 2: Highest producing subsidiary
    res2 = hybrid_query_engine.process_query(db, "Which subsidiary produced the most coal?")
    assert "MCL" in res2["answer"] or "Mahanadi" in res2["answer"]

    # Query 3: Hallucination guard
    res3 = hybrid_query_engine.process_query(db, "Tell me about alien UFO spaceships landing on Mars")
    assert "I could not find sufficient evidence" in res3["answer"]
    assert res3["confidence"] == 0.0

    db.close()
