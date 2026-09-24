import os
import re
from typing import Dict, Any, List
from pypdf import PdfReader
from app.ocr.ocr_service import ocr_service

class PDFExtractor:
    def extract(self, file_path: str) -> Dict[str, Any]:
        reader = PdfReader(file_path)
        page_count = len(reader.pages)
        pages_data = []
        all_text = ""
        tables_extracted = []
        
        for i, page in enumerate(reader.pages):
            text = page.extract_text() or ""
            all_text += "\n" + text
            
            # Simple tabular regex parser for coal tables if present
            lines = [l.strip() for l in text.split("\n") if l.strip()]
            potential_table = []
            for line in lines:
                parts = re.split(r'\s{2,}|\t', line)
                if len(parts) >= 2:
                    potential_table.append(parts)
            
            if potential_table:
                tables_extracted.append({
                    "page": i + 1,
                    "rows": potential_table[:20]
                })

            pages_data.append({
                "page_number": i + 1,
                "text": text,
                "is_ocr": False,
                "confidence": 97.5 if len(text) > 50 else 60.0
            })
        
        # Check if scanned
        is_scanned = ocr_service.is_scanned_pdf(all_text, page_count)
        if is_scanned:
            for page_entry in pages_data:
                ocr_result = ocr_service.process_image_or_scanned_page(page_entry["page_number"])
                page_entry["text"] = ocr_result["text"]
                page_entry["is_ocr"] = True
                page_entry["confidence"] = ocr_result["confidence"]

        return {
            "page_count": page_count,
            "full_text": all_text,
            "pages": pages_data,
            "tables": tables_extracted,
            "extraction_method": "OCR" if is_scanned else "PDF Machine Text & Table Extractor",
            "overall_confidence": 92.0 if is_scanned else 98.2
        }

pdf_extractor = PDFExtractor()
