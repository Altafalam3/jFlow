import streamlit as st
import os
import pypdf
from PIL import Image  
from dotenv import load_dotenv
from Models import get_HF_embeddings, cosine
import nltk

nltk.download('punkt')
nltk.download('punkt_tab')

load_dotenv()  ## load all our environment variables

# Import the Generative AI model if needed
import google.generativeai as genai
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))


def get_gemini_response(input):
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(input)
    return response.text


def input_pdf_text(uploaded_files):
    
    reader = pypdf.PdfReader(uploaded_files)
    text = ""
    for page in range(len(reader.pages)):
        page = reader.pages[page]
        text += str(page.extract_text())
    return text

@st.cache_data
def get_key_info(text):
  """
  Extracts key information from the resume using Gemini
  """
  key_info_prompt = """
  This is a resume for a job applicant. Please analyze the text and provide the following information in a clear and concise format:

  * Name
  * Contact Information (Phone, Email, LinkedIn, Github, etc)
  * Education (Degree, Year, Institution, marks)
  * Work Experience/Internships (Company, Dates, Description)
  * Skills
  * Relevant Coursework

  Resume: {text}
  """
  response = get_gemini_response(key_info_prompt.format(text='\n'.join(text)))
  return response


# System Template
sys_prompt = """
You are an advanced Applicant Tracking System (ATS) with extensive experience in the tech industry, particularly in software engineering. Your primary function is to rigorously evaluate resumes against provided job descriptions. Consider the following guidelines:

1. Approach: Be highly critical and detail-oriented. The job market is extremely competitive, and only the most qualified candidates should receive high ratings.

2. Matching Criteria:
- Essential Skills: Penalize heavily for missing must-have technical skills.
- Experience: Scrutinize the depth and relevance of work experience.
- Education: Consider the relevance and prestige of educational background.
- Projects: Evaluate the complexity and relevance of listed projects.
- Achievements: Look for quantifiable impacts and innovations.

3. Keyword Analysis:
- Identify all keywords in the job description.
- Check for exact matches and semantically similar terms in the resume.
- Penalize for missing important keywords or concepts.

4. Scoring:
- Start from 0% match and add points for meeting criteria.
- Deduct points for missing essential elements.
- Be very selective with high scores (>80% should be rare).

5. Feedback:
- Provide a brief, critical analysis of the resume's strengths and weaknesses.
- List missing keywords and suggest improvements.
- Explain your scoring rationale.

6. Format your response as follows:
{{"JD Match": "X%",
    "Analysis": "Your critical analysis here",
    "Missing Keywords": ["keyword1", "keyword2", ...],
    "Improvement Suggestions": ["suggestion1", "suggestion2", ...]
}}

Remember, your goal is to identify only the most qualified candidates. Be thorough, critical, and maintain high standards in your evaluation.

Resume: {text}
Job Description: {JD}
"""

def compare(resume_texts, JD_text, embedding_method='HuggingFace-BERT'):
    if embedding_method == 'Gemini':
        response = get_gemini_response(sys_prompt.format(text='\n'.join(resume_texts), JD=JD_text))
        return response
    elif embedding_method == 'HuggingFace-BERT':
        JD_embeddings = get_HF_embeddings(JD_text)
        resume_embeddings = [get_HF_embeddings(resume_text) for resume_text in resume_texts]
       
    else:
        return "Invalid embedding method selected."

    cos_scores = cosine(resume_embeddings, JD_embeddings)
    return cos_scores[0]


## streamlit app
st.title("Resume Parsing and Analysis ")


# Define uploaded_file outside the tab selection
uploaded_file = st.file_uploader(
    'Choose your resume.pdf file: ', type="pdf", help="Please upload the pdf"
)

# Tab selection
tab_selection = st.radio("Select Functionality", ["Extract key information", "Compare with Job description"])

if tab_selection == "Extract key information":
    if uploaded_file:
        text = input_pdf_text(uploaded_file)
        key_info = get_key_info(text)
        st.subheader("Key Information:")
        st.write(key_info)
    else:
        st.subheader("Please upload a resume !!")
        
elif tab_selection == "Compare with Job description":
    if uploaded_file:
        JD = st.text_area("**Enter the job description:**")
        embedding_method = st.selectbox("Select Embedding Method", ['Gemini', 'HuggingFace-BERT'])

        submit = st.button("Submit")

        if submit:
            text = input_pdf_text(uploaded_file)
            response = compare([text], JD, embedding_method)
            st.subheader(response)
    else:
        st.subheader("Please upload a resume !!")
