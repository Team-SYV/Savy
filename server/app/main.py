from fastapi import FastAPI, HTTPException, Request, Response, status
from passlib.context import CryptContext  
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from supabase import Client, create_client
from dotenv import load_dotenv
import os
from svix.webhooks import Webhook, WebhookVerificationError
import json

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
webhook_secret = os.getenv("WEBHOOK_SECRET")

supabase: Client = create_client(url, key)

app = FastAPI()

origins = [
    "http://localhost:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class ClerkUserCreate(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    image_url: Optional[str] = None

class ClerkUserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    image_url: Optional[str] = None

@app.post("/api/webhooks/", status_code=status.HTTP_204_NO_CONTENT)
async def clerk_webhook_handler(request: Request, response: Response):
    headers = dict(request.headers)  # Convert headers to a dict
    payload = await request.body()  # Get the raw request body
    payload_str = payload.decode('utf-8')  # Convert bytes to string

    # Log or print payload and headers for debugging
    print("Headers:", headers)
    print("Payload:", payload_str)

    # Ensure required headers are present
    required_headers = ["svix-id", "svix-signature", "svix-timestamp"]
    for header in required_headers:
        if header not in headers:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {"error": "Missing required headers"}

    try:
        wh = Webhook(webhook_secret)
        wh.verify(payload_str, headers)  # Verify with the payload string and headers dict
    except WebhookVerificationError as e:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"error": "Invalid webhook signature", "details": str(e)}

    event = json.loads(payload_str)
    event_type = event.get("type")
    data = event.get("data")

    if event_type == "user.created":
        await handle_user_created(data)
    elif event_type == "user.updated":
        await handle_user_updated(data)
    elif event_type == "user.deleted":
        await handle_user_deleted(data)

    return {"message": "Webhook handled"}


async def handle_user_created(data: dict):
    # Extract the email addresses list
    email_addresses = data.get("email_addresses", [])
    
    # Check if there is at least one email address
    if not email_addresses:
        raise HTTPException(status_code=400, detail="No email address found")

    # Get the email address from the first item in the list
    email_address = email_addresses[0].get("email_address")
    
    if not email_address:
        raise HTTPException(status_code=400, detail="Email address is missing")

    user = ClerkUserCreate(
        id=data.get("id", ""),
        first_name=data.get("first_name", ""),
        last_name=data.get("last_name", ""),
        email=email_address,
        image_url=data.get("profile_image_url")
    )

    existing_user_response = supabase.table('users').select('email').eq('email', user.email).execute()

    if existing_user_response.data:
        raise HTTPException(status_code=400, detail="Email already in use")

    supabase.table('users').insert({
            'id': user.id,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'email': user.email,
            'image': user.image_url
        }).execute()

async def handle_user_updated(data: dict):
    user_id = data["id"]
    user_update = ClerkUserUpdate(
        first_name=data.get("first_name"),
        last_name=data.get("last_name"),
        email=data.get("email_address"),
        image_url=data.get("profile_image_url")
    )

    user_response = supabase.table('users').select('*').eq('id', user_id).execute()

    if not user_response.data:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = user_response.data[0]
    updated_data = {**user_data}

    if user_update.first_name:
        updated_data['firstName'] = user_update.first_name
    if user_update.last_name:
        updated_data['lastName'] = user_update.last_name
    if user_update.email:
        email_check_response = supabase.table('users').select('id').eq('email', user_update.email).execute()
        if email_check_response.data and email_check_response.data[0]['id'] != user_id:
            raise HTTPException(status_code=400, detail="Email already in use")
        updated_data['email'] = user_update.email
    if user_update.image_url:
        updated_data['image'] = user_update.image_url

    supabase.table('users').update(updated_data).eq('id', user_id).execute()

async def handle_user_deleted(data: dict):
    user_id = data["id"]
    supabase.table('users').delete().eq('id', user_id).execute()
