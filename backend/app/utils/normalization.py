import re
from typing import Tuple, Optional

SUBSIDIARY_MAP = {
    "ecl": "ECL",
    "eastern coalfields": "ECL",
    "eastern coalfields limited": "ECL",
    "bccl": "BCCL",
    "bharat coking coal": "BCCL",
    "bharat coking coal limited": "BCCL",
    "ccl": "CCL",
    "central coalfields": "CCL",
    "central coalfields limited": "CCL",
    "ncl": "NCL",
    "northern coalfields": "NCL",
    "northern coalfields limited": "NCL",
    "wcl": "WCL",
    "western coalfields": "WCL",
    "western coalfields limited": "WCL",
    "secl": "SECL",
    "south eastern coalfields": "SECL",
    "south eastern coalfields limited": "SECL",
    "mcl": "MCL",
    "mahanadi coalfields": "MCL",
    "mahanadi coalfields limited": "MCL",
    "nec": "NEC",
    "north eastern coalfields": "NEC",
    "cil": "Coal India Limited (CIL)",
    "coal india": "Coal India Limited (CIL)",
    "coal india limited": "Coal India Limited (CIL)",
    "sccl": "SCCL",
    "singareni": "SCCL",
    "singareni collieries": "SCCL",
    "captive": "Captive & Others",
    "commercial": "Commercial & Others"
}

def normalize_subsidiary(name: str) -> str:
    if not name:
        return "Unknown"
    cleaned = name.strip().lower()
    cleaned = re.sub(r'[^a-z0-9\s]', '', cleaned)
    for key, val in SUBSIDIARY_MAP.items():
        if key == cleaned or cleaned.startswith(key):
            return val
    return name.strip().upper()

def normalize_unit_to_mt(value: float, unit_str: str) -> float:
    """
    Normalizes numeric figures to Million Tonnes (MT).
    Supported input units: tonnes, thousand tonnes, lakh tonnes, million tonnes (MT), billion tonnes.
    """
    if not unit_str:
        return value
    u = unit_str.strip().lower()
    if "billion" in u:
        return value * 1000.0
    elif "million" in u or "mt" in u:
        return value
    elif "lakh" in u:
        return value * 0.1
    elif "thousand" in u or "000 tonnes" in u or "'000" in u:
        return value / 1000.0
    elif "tonnes" in u or "tonne" in u:
        return value / 1_000_000.0
    return value

def normalize_financial_year(year_str: str) -> str:
    """
    Normalizes '2024-25', '2024-2025', 'FY25', 'FY 2024-25' into standard '2024-25'
    """
    if not year_str:
        return "2024-25"
    s = str(year_str).strip()
    match = re.search(r'(20\d{2})[-/](20)?(\d{2})', s)
    if match:
        start_year = match.group(1)
        end_short = match.group(3)
        return f"{start_year}-{end_short}"
    match_fy = re.search(r'fy\s*(\d{2})', s, re.IGNORECASE)
    if match_fy:
        end_short = int(match_fy.group(1))
        start_year = 2000 + end_short - 1
        return f"{start_year}-{end_short:02d}"
    return s

def normalize_coal_type(coal_str: str) -> str:
    if not coal_str:
        return "Non-Coking"
    c = coal_str.strip().lower()
    if "non-coking" in c or "non coking" in c or "thermal" in c:
        return "Non-Coking"
    if "coking" in c or "metallurgical" in c:
        return "Coking"
    return "Non-Coking"
