from fastapi import FastAPI, Form, Request, Response, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.utils import get_supabase_client
from app.webhooks import clerk_webhook_handler
from app.jobInformation import create_job_information as create_job_info, update_job_information_with_resume
import os
import logging

logging.basicConfig(level=logging.DEBUG)
app = FastAPI()

supabase = get_supabase_client()
webhook_secret = os.getenv("WEBHOOK_SECRET")

origins = ["http://localhost:8081"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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

@app.post("/api/resumes/upload/")
async def upload_resume(file: UploadFile = File(...), user_id: str = Form(...)):
    try:
        # Log received data
        print(f"Received user_id: {user_id}")
        print(f"Received file name: {file.filename}")
        print(f"Received file content type: {file.content_type}")

        # Read file content
        file_content = await file.read()
        print(f"File content size: {len(file_content)} bytes")

        if not file_content:
            raise HTTPException(status_code=400, detail="File content is empty")

        # Generate a shorter file name
        file_name = f"{user_id}_{file.filename}"
        if len(file_name) > 100:  # Example max length, adjust as needed
            file_name = f"{user_id[:10]}_{file.filename[:80]}"

        bucket_name = "resumes"

        # Log bucket and file name
        print(f"Uploading to bucket: {bucket_name}, as file: {file_name}")

        # Upload file to Supabase
        response = supabase.storage.from_(bucket_name).upload(file_name, file_content, {
            'content-type': file.content_type,
        })

        # Log Supabase response
        print(f"Supabase upload response: {response}")

        if 'error' in response:
            raise HTTPException(status_code=500, detail=f"Supabase upload failed: {response['error']['message']}")

        file_url = supabase.storage.from_(bucket_name).get_public_url(file_name)
        print(f"File URL: {file_url}")

        return {"message": "File uploaded successfully", "file_url": file_url}
    
    except HTTPException as e:
        print(f"HTTPException: {str(e)}")
        raise e
    except Exception as e:
        print(f"Exception: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
