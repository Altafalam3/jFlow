import re
from collections import Counter
from typing import Dict, List, Tuple

class ResumeAnalyzer:
    def __init__(self):
        self.keywords = set(['experience', 'skills', 'education', 'projects'])
        self.common_words = set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'])
        #Output
        self.score = 0
        self.improvements = []
        self.description = ""

    def analyze_resume(self, resume_text: str) -> Dict:
        word_count = len(resume_text.split())
        keyword_count = sum(1 for word in resume_text.lower().split() if word in self.keywords)
        
        score = min(keyword_count / len(self.keywords) * 100, 100)
        
        analysis = {
            'score': score,
            'word_count': word_count,
            'keyword_count': keyword_count,
            'description': self._generate_description(resume_text),
            'improvements': self._suggest_improvements(resume_text)
        }
        
        return analysis

    def analyze_resume_against_jd(self, resume_text: str, jd_text: str) -> Dict:
        resume_words = set(word.lower() for word in resume_text.split() if word.lower() not in self.common_words)
        jd_words = set(word.lower() for word in jd_text.split() if word.lower() not in self.common_words)
        
        matching_keywords = resume_words.intersection(jd_words)
        missing_keywords = jd_words - resume_words
        
        score = len(matching_keywords) / len(jd_words) * 100
        
        analysis = {
            'score': score,
            'matching_keywords': list(matching_keywords),
            'missing_keywords': list(missing_keywords),
            'description': self._generate_description(resume_text, jd_text),
            'improvements': self._suggest_improvements(resume_text, jd_text)
        }
        
        return analysis

    def _generate_description(self, resume_text: str, jd_text: str = None) -> str:
        # Implement logic to generate a short description of the resume
        # This is a placeholder implementation
        return "This is a placeholder description of the resume."

    def _suggest_improvements(self, resume_text: str, jd_text: str = None) -> List[str]:
        # Implement logic to suggest improvements
        # This is a placeholder implementation
        return ["Suggestion 1", "Suggestion 2", "Suggestion 3"]

# Usage example
analyzer = ResumeAnalyzer()

resume = """
John Doe
Software Engineer

Experience:
- Developed web applications using Python and Django
- Implemented machine learning models for data analysis

Skills:
- Python, Java, SQL
- Machine Learning, Data Analysis

Education:
- Bachelor's in Computer Science, XYZ University
"""

jd = """
We are looking for a Software Engineer with the following qualifications:
- Experience in Python and web development frameworks like Django or Flask
- Strong understanding of machine learning concepts
- Familiarity with cloud platforms (AWS, GCP, or Azure)
- Good communication skills
"""

print(analyzer.analyze_resume(resume))
print(analyzer.analyze_resume_against_jd(resume, jd))