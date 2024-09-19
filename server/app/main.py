from fastapi import FastAPI, Request, Response, status
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from app.utils import get_supabase_client
from app.webhooks import clerk_webhook_handler
from app.jobInformation import create_job_information as create_job_info
from app.jobInformation import update_job_information_with_resume as update_job_info
from app.interview import create_interview

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
    
@app.put("/api/resumes/create")
async def create_resume(request: Request):
    resume_data = await request.json()
    return await run_in_threadpool(update_job_info, resume_data, supabase)

@app.post("/api/interview/create")
async def create_interview_endpoint(request: Request):
    interview_data = await request.json()
    return create_interview(interview_data, supabase)