import os
import json
import csv
from pathlib import Path
from typing import List, Dict, Any

class DocumentParser:
    """Multi-format document extractor supporting PDF, DOCX, TXT, MD, CSV, and JSON."""
    
    @staticmethod
    def parse_file(file_path: Path) -> List[Dict[str, Any]]:
        """
        Parses a file and returns a list of pages/sections with text and metadata.
        Output format: [{"page": int, "section": str, "content": str}]
        """
        ext = file_path.suffix.lower()
        if ext == ".pdf":
            return DocumentParser._parse_pdf(file_path)
        elif ext in [".docx", ".doc"]:
            return DocumentParser._parse_docx(file_path)
        elif ext == ".csv":
            return DocumentParser._parse_csv(file_path)
        elif ext == ".json":
            return DocumentParser._parse_json(file_path)
        elif ext in [".txt", ".md", ".py", ".js", ".html", ".css", ".yaml", ".yml"]:
            return DocumentParser._parse_text(file_path)
        else:
            # Fallback to UTF-8 text read
            return DocumentParser._parse_text(file_path)

    @staticmethod
    def _parse_pdf(file_path: Path) -> List[Dict[str, Any]]:
        pages_content = []
        try:
            import pypdf
            reader = pypdf.PdfReader(str(file_path))
            for i, page in enumerate(reader.pages):
                text = page.extract_text() or ""
                if text.strip():
                    pages_content.append({
                        "page": i + 1,
                        "section": f"Page {i + 1}",
                        "content": text.strip()
                    })
        except Exception as e:
            # Fallback if pypdf has any issue
            pages_content.append({
                "page": 1,
                "section": "Raw Text",
                "content": f"[Error reading PDF: {e}]"
            })
        return pages_content

    @staticmethod
    def _parse_docx(file_path: Path) -> List[Dict[str, Any]]:
        pages_content = []
        try:
            import docx
            doc = docx.Document(str(file_path))
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            full_text = "\n\n".join(paragraphs)
            pages_content.append({
                "page": 1,
                "section": "Document Body",
                "content": full_text
            })
        except Exception as e:
            pages_content.append({
                "page": 1,
                "section": "Error",
                "content": f"[Error reading DOCX: {e}]"
            })
        return pages_content

    @staticmethod
    def _parse_csv(file_path: Path) -> List[Dict[str, Any]]:
        pages_content = []
        try:
            with open(file_path, mode="r", encoding="utf-8", errors="ignore") as f:
                reader = csv.reader(f)
                rows = list(reader)
                if not rows:
                    return []
                header = rows[0]
                text_lines = [", ".join(header)]
                for row in rows[1:500]: # Cap first 500 rows
                    text_lines.append(", ".join(row))
                pages_content.append({
                    "page": 1,
                    "section": "CSV Table Data",
                    "content": "\n".join(text_lines)
                })
        except Exception as e:
            pages_content.append({
                "page": 1,
                "section": "Error",
                "content": f"[Error reading CSV: {e}]"
            })
        return pages_content

    @staticmethod
    def _parse_json(file_path: Path) -> List[Dict[str, Any]]:
        pages_content = []
        try:
            with open(file_path, mode="r", encoding="utf-8", errors="ignore") as f:
                data = json.load(f)
                text = json.dumps(data, indent=2)
                pages_content.append({
                    "page": 1,
                    "section": "JSON Structure",
                    "content": text
                })
        except Exception as e:
            pages_content.append({
                "page": 1,
                "section": "Error",
                "content": f"[Error reading JSON: {e}]"
            })
        return pages_content

    @staticmethod
    def _parse_text(file_path: Path) -> List[Dict[str, Any]]:
        pages_content = []
        try:
            with open(file_path, mode="r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
                # Split by sections or headers if markdown
                pages_content.append({
                    "page": 1,
                    "section": file_path.name,
                    "content": text.strip()
                })
        except Exception as e:
            pages_content.append({
                "page": 1,
                "section": "Error",
                "content": f"[Error reading text file: {e}]"
            })
        return pages_content
