import streamlit as st
from utils import extract_raw_text_from_pdf
from chains import Chain
from langchain.chains.conversation.memory import ConversationBufferMemory

def create_streamlit_app(llm):
    st.title("📄 Career Guidance")

    col1, col2 = st.columns([1, 3])

    # Initialize conversation memory if not already in session state
    if "memory" not in st.session_state:
        st.session_state["memory"] = ConversationBufferMemory()

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

                # Retrieve conversation history from memory
                conversation_history = st.session_state["memory"].buffer
                conversation_context = f"Previous conversation:\n{conversation_history}\nUser message: {chat_input}"

                if resume_info:
                    response = llm.chat_with_llm(conversation_context, resume_info=resume_info)
                else:
                    response = llm.chat_with_llm(conversation_context)

                # Save user message and AI response in memory
                st.session_state["memory"].chat_memory.add_user_message(chat_input)
                st.session_state["memory"].chat_memory.add_ai_message(response)

                # Display the latest response
                st.write(f"**AI:** {response}")

            except Exception as e:
                st.error(f"An error occurred while chatting: {e}")

if __name__ == "__main__":
    chain = Chain()
    st.set_page_config(layout="wide", page_title="Career Guidance", page_icon="📄")
    create_streamlit_app(chain)
