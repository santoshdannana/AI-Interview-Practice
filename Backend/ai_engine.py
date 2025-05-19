import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("models/gemini-2.0-flash")

def gemini_feedback(prompt: str) -> str:
    response = model.generate_content(prompt)
    return response.text.strip()

def generate_questions(resume_text: str, jd_text: str, company: str, focus_area: str, difficulty: str, duration: str) -> list:
    prompt = f"""
You are a professional mock interviewer helping prepare candidates for roles at {company}.

Context:
- The resume and job description are below.
- The candidate wants the interview to focus more on: {focus_area}
- The desired difficulty level is: {difficulty}
- The total interview time is expected to be around: {duration}

Resume:
{resume_text}

Job Description:
{jd_text}

Your task:
Generate questions based on the duration, difficulty, more on focused area I gave and natural-sounding mock interview questions.

Guidelines:
- Start with a welcome and ask the candidate to introduce themselves.
- Use realistic, human-like, spoken tone.
- Each question should take no more than 20 seconds to speak aloud.
- Categories to include based on focus area: {focus_area}
- First Question should be to ask about introduction
- DO NOT label the categories.
- DO NOT use bullet points or numbers.
- DO NOT wrap in markdown.
- Just output a plain list of questions, one per line.
"""

    response = model.generate_content(prompt)
    return [q.strip() for q in response.text.strip().split("\n") if q.strip()]
