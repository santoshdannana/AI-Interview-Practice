from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from parser import extract_text  # use updated parser with docx support
from ai_engine import generate_questions, gemini_feedback
from pydantic import BaseModel

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Feedback route
class FeedbackRequest(BaseModel):
    prompt: str

@app.post("/ai-feedback")
async def ai_feedback(data: FeedbackRequest):
    try:
        return {"feedback": gemini_feedback(data.prompt)}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# Upload and generate questions
@app.post("/upload/")
async def upload_files(
    resume: UploadFile = File(...),
    job_description: UploadFile = File(...),
    company: str = Form(...),
    focus_area: str = Form(...),
    difficulty: str = Form(...),
    duration: str = Form(...)
):
    try:
        resume_text = extract_text(resume)
        jd_text = extract_text(job_description)

        questions = generate_questions(
            resume_text=resume_text,
            jd_text=jd_text,
            company=company,
            focus_area=focus_area,
            difficulty=difficulty,
            duration=duration,
        )

        return {"questions": questions}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Failed to process files: {str(e)}"})

# Health check
@app.get("/")
def read_root():
    return {"message": "AI Interview API is running!"}
