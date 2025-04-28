import fitz  # PyMuPDF
from docx import Document
import io

def extract_text(uploaded_file) -> str:
    filename = uploaded_file.filename.lower()
    file_bytes = uploaded_file.file.read()

    if filename.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)
    elif filename.endswith(".docx"):
        return extract_text_from_docx(file_bytes)
    else:
        raise ValueError("Unsupported file format. Please upload a PDF or DOCX file.")

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    doc = fitz.open("pdf", pdf_bytes)
    return "\n".join([page.get_text() for page in doc]).strip()

def extract_text_from_docx(docx_bytes: bytes) -> str:
    doc = Document(io.BytesIO(docx_bytes))
    return "\n".join([para.text for para in doc.paragraphs]).strip()
