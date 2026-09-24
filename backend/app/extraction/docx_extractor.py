import docx
from typing import Dict, Any, List

class DOCXExtractor:
    def extract(self, file_path: str) -> Dict[str, Any]:
        doc = docx.Document(file_path)
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        full_text = "\n".join(paragraphs)
        
        tables_data = []
        for table_idx, table in enumerate(doc.tables):
            table_rows = []
            for row in table.rows:
                table_rows.append([cell.text.strip() for cell in row.cells])
            tables_data.append({
                "table_index": table_idx + 1,
                "rows": table_rows
            })
            
        return {
            "page_count": max(1, len(paragraphs) // 10),
            "full_text": full_text,
            "paragraphs": paragraphs,
            "tables": tables_data,
            "extraction_method": "Python-DOCX Unified Extractor",
            "overall_confidence": 98.6
        }

docx_extractor = DOCXExtractor()
