import os
from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from app.utils import get_supabase_client
from app.webhooks import clerk_webhook_handler
from app.jobInformation import create_job_description

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
    return create_job_information(job_data, supabase)
