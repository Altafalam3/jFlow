import streamlit as st
from utils import extract_raw_text_from_pdf
from chains import Chain

def create_streamlit_app(llm):
    st.title("📄 Career Guidance")

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

    # Chat section for interacting with LLM
    with col2:
        st.write("### Chat with AI Assistant")

        # Chat input
        chat_input = st.text_input("Ask for resume improvements, job advice, or any other question:")

        # Chat functionality
        if st.button("Send"):
            try:
                resume_info = st.session_state.get("resume_info", None)
                if resume_info:
                    response = llm.chat_with_llm(chat_input, resume_info=resume_info)
                else:
                    response = llm.chat_with_llm(chat_input)

                st.write(f"### AI:\n {response}")
            except Exception as e:
                st.error(f"An error occurred while chatting: {e}")

if __name__ == "__main__":
    chain = Chain()
    st.set_page_config(layout="wide", page_title="Resume Assistant", page_icon="📄")
    create_streamlit_app(chain)
