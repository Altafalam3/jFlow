import pdfplumber

def extract_raw_text_from_pdf(file_path):
    resume_text = ''
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            resume_text += page.extract_text() + ' '
    return resume_text

