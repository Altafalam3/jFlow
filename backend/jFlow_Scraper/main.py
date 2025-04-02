import os
import uuid
from fastapi import FastAPI, Form, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import json

from langchain_community.document_loaders import WebBaseLoader
from chains import Chain
from utils import create_formatted_cover_letter_docx

app = FastAPI(title="AI Assistant FastAPI")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize your chain (which wraps the Groq Llama integration)
llm = Chain()

@app.post("/extract-job")
async def extract_job(job_link: str = Form(...)):
    """
    Given a job link, fetch the entire webpage content and extract structured job details.
    (Assume your Chain.extract_jobs() expects the full scraped text.)
    """
    try:
        loader = WebBaseLoader([job_link])
        job_data = loader.load().pop().page_content
        jobs = llm.extract_jobs(job_data)
        return JSONResponse(status_code=200, content={"jobs": jobs})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat")
async def chat_with_ai(message: str = Form(...),
                       resume_info: str = Form(...),
                       job_info: str = Form(...)):
    """
    Chat endpoint: Sends the user’s message along with resume and job JSON strings.
    """
    try:
        # Convert resume_info and job_info strings (assumed JSON) into dicts if needed.
        resume_data = json.loads(resume_info)
        job_data = json.loads(job_info)
        response_text = llm.chat_with_llm(message, resume_info=resume_data, job_info=job_data)
        return JSONResponse(status_code=200, content={"response": response_text})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/cover-letter")
async def generate_cover_letter(resume_info: str = Form(...),
                                job_info: str = Form(...),
                                additional_info: str = Form(default="")):
    """
    Generate a cover letter using the provided job and resume info.
    Returns the cover letter text (JSON with key "coverLetter").
    """
    try:
        job_data = json.loads(job_info)
        resume_data = json.loads(resume_info)
        cover_letter_text = llm.write_cover_letter(job_data, resume_data, additional_info)
        return JSONResponse(status_code=200, content={"coverLetter": cover_letter_text})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/match-percentage")
async def get_match_percentage(job_info: str = Form(...), resume_info: str = Form(...)):
    """
    Compute a match percentage by comparing resume info and job description.
    """
    try:
        resume_data = json.loads(resume_info)
        job_data = json.loads(job_info)
        match_percentage = llm.resume_jd_match(resume_info=resume_data, job_info=job_data)
        match_data = json.loads(match_percentage)
        return JSONResponse(status_code=200, content=match_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/download-cover-letter")
async def download_cover_letter(cover_letter_text: str = Form(...)):
    """
    Given an edited cover letter text, generate a well-formatted DOCX file and return it.
    """
    try:
        # Create a unique filename and ensure a temporary directory exists
        filename = f"cover_letter_{uuid.uuid4().hex}.docx"
        temp_dir = "temp"
        os.makedirs(temp_dir, exist_ok=True)
        filepath = os.path.join(temp_dir, filename)
        create_formatted_cover_letter_docx(cover_letter_text, filename=filepath)
        return FileResponse(path=filepath, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", filename=filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
'''
def create_streamlit_app(llm):
    st.title("📄 AI Based Job Assistant")

    col1, col2 = st.columns([1, 3])

    # Resume uploader (automatic processing on upload)
    with col1:
        uploaded_file = st.file_uploader("Upload your Resume (PDF)", type=["pdf"], key="resume_uploader")
        
        # Automatically process the resume once uploaded
        if uploaded_file is not None and "resume_info" not in st.session_state:
            resume_text = extract_raw_text_from_pdf(uploaded_file)
            resume_info = llm.extract_resume_details(resume_text)
            st.session_state["resume_uploaded"] = uploaded_file
            st.session_state["resume_info"] = resume_info
            st.success("Resume details extracted and saved!")

        # Job description link input
        url_input = st.text_input("Enter the Job URL:", value=st.session_state.get("job_url", "https://rocketlane.freshteam.com/jobs/hzabyJhRp-od/react-frontend-developer"), key="job_url_input")
        if url_input:
            st.session_state["job_url"] = url_input

        # Submit button for JD processing
        submit_button = st.button("Extract Job Details")

        # Job data extraction when submit button is pressed
        if submit_button:
            if "job_url" in st.session_state:
                try:
                    loader = WebBaseLoader([st.session_state["job_url"]])
                    job_data = loader.load().pop().page_content
                    jobs = llm.extract_jobs(job_data)
                    st.session_state["job_data"] = jobs
                    st.success("Job details extracted and saved!")
                except Exception as e:
                    st.error(f"An Error Occurred while extracting the job details: {e}")
            else:
                st.error("Please provide a Job URL.")

        # Additional info input
        additional_info = st.text_area("Additional Information (optional):", key="additional_info_input")

        # Quick Cover Letter Generator button (stays on the left)
        if st.button("Quick Cover Letter Generator"):
            if "resume_info" in st.session_state and "job_data" in st.session_state:
                resume_info = st.session_state["resume_info"]
                jobs = st.session_state["job_data"]

                for job in jobs:
                    cover_letter = llm.write_cover_letter(job, resume_info, additional_info)
                    st.session_state[f"cover_letter_text_{job['role']}"] = cover_letter

                st.session_state["generate_cover_letter"] = True
            else:
                st.error("Both resume and Job link required to generate cover letter")

    # Chat and Cover Letter Generation section (on the right)
    with col2:
        st.write("### Chat with AI Assistant")

        # Chat input
        chat_input = st.text_input("Ask for resume improvements, job advice, or any other question:")

        # Chat functionality
        if st.button("Send"):
            st.session_state["generate_cover_letter"] = False  # Reset state after showing

            try:
                resume_info = st.session_state.get("resume_info", None)
                jobs = st.session_state.get("job_data", None)
                if resume_info and jobs:
                    response = llm.chat_with_llm(chat_input, resume_info=resume_info, job_info=jobs[0])
                elif resume_info:
                    response = llm.chat_with_llm(chat_input, resume_info=resume_info)
                elif jobs:
                    response = llm.chat_with_llm(chat_input, resume_info=None, job_info=jobs[0])
                else:
                    response = llm.chat_with_llm(chat_input)

                st.write(f"### AI:\n {response}")
            except Exception as e:
                st.error(f"An error occurred while chatting: {e}")

        # Show the cover letter output in the right column if button clicked
        if st.session_state.get("generate_cover_letter", False):
            resume_info = st.session_state["resume_info"]
            jobs = st.session_state["job_data"]

            for job in jobs:
                st.markdown(f"### Cover Letter for {job['role']} at {job['company_name']}")

                cover_letter_textarea = st.text_area(
                    "Edit your cover letter here:",
                    value=st.session_state.get(f"cover_letter_text_{job['role']}", ""),
                    height=400,
                    key=f"cover_letter_textarea_{job['role']}"
                )

                # Update session state with the latest edited cover letter
                st.session_state[f"cover_letter_text_{job['role']}"] = cover_letter_textarea

                # Generate and automatically download .docx when clicking the button
                if st.button(f"Download Cover Letter (.docx)", key=f"download_{job['role']}"):
                    try:
                        docx_file_path = create_formatted_cover_letter_docx(st.session_state[f"cover_letter_text_{job['role']}"])

                        with open(docx_file_path, "rb") as docx_file:
                            docx_data = docx_file.read()
                            b64 = base64.b64encode(docx_data).decode()
                            href = f'<a href="data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,{b64}" download="cover_letter_{job["role"]}.docx">Click here if download not started yet</a>'
                            st.markdown(href, unsafe_allow_html=True)
                    except KeyError as e:
                        st.error(f"Missing information in the resume or job details: {e}")
                    except Exception as e:
                        st.error(f"An error occurred during .docx generation: {e}")

if __name__ == "__main__":
    chain = Chain()
    st.set_page_config(layout="wide", page_title="Cover Letter Generator & Assistant", page_icon="📄")
    create_streamlit_app(chain)
'''