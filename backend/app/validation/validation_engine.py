import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("coal_intelligence.validation")

class ValidationEngine:
    """
    Automated validation engine for geological and coal production reporting.
    Validates mathematical consistency, subsidiary subtotals, unit ranges, and anomalies.
    """
    
    def validate_production_records(self, records: List[Dict[str, Any]], expected_year: Optional[str] = None) -> List[Dict[str, Any]]:
        anomalies = []
        
        # 1. Check for negative numbers or missing mandatory fields
        seen_keys = set()
        subsidiary_sum = 0.0
        reported_cil_total = None
        
        for r in records:
            sub = r.get("subsidiary", "").strip().upper()
            prod = r.get("production_mt")
            year = r.get("year", "")
            
            # Missing / Null Checks
            if prod is None:
                anomalies.append({
                    "validation_type": "Missing Value",
                    "severity": "High",
                    "expected_value": "> 0.0 MT",
                    "actual_value": "None/Null",
                    "message": f"Missing production figure for subsidiary {sub} in year {year}"
                })
                continue
                
            # Range / Negative checks
            if prod < 0:
                anomalies.append({
                    "validation_type": "Invalid Value Range",
                    "severity": "Critical",
                    "expected_value": ">= 0.0 MT",
                    "actual_value": f"{prod} MT",
                    "message": f"Negative production value detected for {sub}: {prod} MT"
                })
            
            # Year consistency check
            if expected_year and year and year != expected_year:
                anomalies.append({
                    "validation_type": "Financial Year Mismatch",
                    "severity": "Medium",
                    "expected_value": expected_year,
                    "actual_value": year,
                    "message": f"Document context claims FY {expected_year}, but row reports FY {year}"
                })
                
            # Duplicate check
            dup_key = f"{year}:{sub}"
            if dup_key in seen_keys:
                anomalies.append({
                    "validation_type": "Duplicate Record",
                    "severity": "Medium",
                    "expected_value": "Unique record",
                    "actual_value": f"Duplicate for {sub} ({year})",
                    "message": f"Duplicate production record found for subsidiary {sub} in {year}"
                })
            seen_keys.add(dup_key)
            
            # Target anomaly check
            target = r.get("target_mt")
            if target and target > 0:
                ratio = prod / target
                if ratio > 1.35:
                    anomalies.append({
                        "validation_type": "Target Deviation Anomaly",
                        "severity": "Medium",
                        "expected_value": f"Within ±25% of target ({target} MT)",
                        "actual_value": f"{prod} MT (+{(ratio - 1)*100:.1f}%)",
                        "message": f"{sub} exceeded target by {(ratio - 1)*100:.1f}%, possible recording or unit anomaly"
                    })
                elif ratio < 0.5:
                    anomalies.append({
                        "validation_type": "Significant Target Deficit",
                        "severity": "High",
                        "expected_value": f"Near target ({target} MT)",
                        "actual_value": f"{prod} MT (-{(1 - ratio)*100:.1f}%)",
                        "message": f"{sub} fell short of production target by {(1 - ratio)*100:.1f}%"
                    })
            
            # Track CIL vs Subsidiaries for subtotal reconciliation
            if "CIL" in sub or "COAL INDIA" in sub:
                reported_cil_total = prod
            elif sub in ["ECL", "BCCL", "CCL", "NCL", "WCL", "SECL", "MCL", "NEC"]:
                subsidiary_sum += prod
                
        # 2. Subtotal Reconciliation Check
        if reported_cil_total is not None and subsidiary_sum > 0:
            diff = abs(reported_cil_total - subsidiary_sum)
            # If difference exceeds 1.5 MT
            if diff > 1.5:
                severity = "Critical" if diff > 10.0 else "High"
                anomalies.append({
                    "validation_type": "Subtotal Inconsistency",
                    "severity": severity,
                    "expected_value": f"{reported_cil_total:.2f} MT (CIL Total)",
                    "actual_value": f"{subsidiary_sum:.2f} MT (Subsidiary Sum)",
                    "message": f"Mathematical discrepancy detected: Sum of subsidiaries ({subsidiary_sum:.2f} MT) does not match reported CIL Total ({reported_cil_total:.2f} MT). Difference: {diff:.2f} MT"
                })
                
        return anomalies

validation_engine = ValidationEngine()
