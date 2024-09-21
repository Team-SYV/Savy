from fastapi import FastAPI, HTTPException, Request, Response, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.utils import get_supabase_client
from app.webhooks import clerk_webhook_handler
from app.jobInformation import create_job_information as create_job_info
from app.interview import create_interview

import os
import logging

from app.pdf_to_text import convert_pdf_to_text


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
    
@app.post("/api/interview/create")
async def create_interview_endpoint(request: Request):
    interview_data = await request.json()
    return create_interview(interview_data, supabase)

@app.post("/api/convert-pdf/")
async def convert_pdf_endpoint(file: UploadFile = File(...)):
    try:
        file_location = f"/tmp/{file.filename}"
        with open(file_location, "wb") as f:
            f.write(await file.read())

        extracted_text = convert_pdf_to_text(file_location)

        os.remove(file_location)

        return {"text": extracted_text}
    
    except Exception as e:
        logging.error(f"Error processing PDF: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process PDF file")