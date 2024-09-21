from fastapi import FastAPI, HTTPException, Request, Response, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.utils import get_supabase_client
from app.webhooks import clerk_webhook_handler
from app.jobInformation import create_job_information as create_job_info
from app.jobInformation import get_job_information as fetch_job_info
from app.interview import create_interview
from app.pdf_to_text import convert_pdf_to_text
from app.question_generator import generate_interview_questions

import os
import logging

logging.basicConfig(level=logging.DEBUG)
app = FastAPI()

supabase = get_supabase_client()
webhook_secret = os.getenv("WEBHOOK_SECRET")

origins = ["http://localhost:8081",
           ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/webhooks/", status_code=status.HTTP_204_NO_CONTENT)
async def webhook_handler(request: Request, response: Response):
    return await clerk_webhook_handler(request, response, supabase, webhook_secret)

@app.post("/api/job_information/create/")
async def create_job_information(request: Request):
    job_data = await request.json()
    return create_job_info(job_data, supabase)

@app.get("/api/job_information/{job_id}/")
async def get_job_information(job_id: str):
    return fetch_job_info(job_id, supabase) 

@app.post("/api/interview/create")
async def create_interview_endpoint(request: Request):
    interview_data = await request.json()
    return create_interview(interview_data, supabase)

@app.post("/api/generate-questions/")
async def generate_questions(
    file: UploadFile = File(...),
    industry: str = None,
    experience_level: str = None,
    interview_type: str = None,
    job_description: str = None,
    company_name: str = None,
    job_role: str = None,
):
    try:
        file_path = f"/tmp/{file.filename}"
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        resume_text = convert_pdf_to_text(file_path)

        questions = generate_interview_questions(
            industry=industry,
            experience_level=experience_level,
            interview_type=interview_type,
            job_description=job_description,
            company_name=company_name,
            job_role=job_role,
            resume_text=resume_text,
        )

        return {"questions": questions}
    
    except Exception as e:
        logging.error(f"Error generating questions: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate questions")
