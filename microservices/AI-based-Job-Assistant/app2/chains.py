import os
import datetime
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException
from dotenv import load_dotenv
load_dotenv()

class Chain:
    def __init__(self):
        self.llm = ChatGroq(
            temperature=0.2,
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama-3.1-70b-versatile"
        )

    def extract_resume_details(self, resume_text):
        prompt_resume = PromptTemplate.from_template(
            """
            ### RESUME TEXT:
            {resume_text}

            ### INSTRUCTION:
            Parse the provided resume text and return a structured JSON format containing the following keys: 
            `name`, `email`, `phone_number`, `address`, `education`, `skills`, `experience`, `projects`, `extra_curricular`, and `committees_and_clubs`.
            Ensure that all sections are captured accurately and concisely. The `address` field is optional and should be included only if present.
            ### VALID JSON (NO PREAMBLE):
            """
        )
        chain_resume = prompt_resume | self.llm
        res = chain_resume.invoke({"resume_text": resume_text})

        try:
            json_parser = JsonOutputParser()
            res = json_parser.parse(res.content)
            print(res, "\n\n\n")
        except OutputParserException:
            raise OutputParserException("Unable to parse resume details.")

        return res if isinstance(res, dict) else {}

    def chat_with_llm(self, message, resume_info=None):
        prompt_chat = PromptTemplate.from_template(
            """
            ### USER QUESTION:
            {user_message}

            ### RESUME INFORMATION (OPTIONAL):
            {resume_info}


            ### INSTRUCTION:
            Assume you are an Career Guider Expert , you can see user's resume  they are doing and their work experience .
            If they are thinking to switch career tell What do you think is it a good option or not .
            Describe in terms of growth, salary, skills , experience in current industry and fresher in another etc take all the factors with pros and cons into consideration.
            Provide an intelligent and helpful response to the user’s query. User is indian. If they want to switch and know way then you can give user a roadmap type so that he can enter into the industry he wants to.
            ### RESPONSE:
            """
        )
        chain_chat = prompt_chat | self.llm
        res = chain_chat.invoke({
            "user_message": message,
            "resume_info": resume_info or "No resume info provided.",
        })
        return res.content

if __name__ == "__main__":
    print(os.getenv("GROQ_API_KEY"))
