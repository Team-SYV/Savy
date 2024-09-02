from fastapi import FastAPI, HTTPException
from passlib.context import CryptContext  
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from supabase import Client, create_client
from dotenv import load_dotenv
import os

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

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

class UserCreate(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str
    image: str

class UserUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: Optional[str] = None
    image: Optional[str] = None

@app.post("/users/create/")
async def create_user(user: UserCreate):
    existing_user_response = supabase.table('users').select('email').eq('email', user.email).execute()

    if existing_user_response.data:
        raise HTTPException(status_code=400, detail="Email already in use")

    hashed_password = pwd_context.hash(user.password)
    supabase.table('users').insert({
            'firstName': user.firstName,
            'lastName': user.lastName,
            'email': user.email,
            'password': hashed_password,
            'image': user.image
        }).execute()
    
    return {"message": "User Created Succesfully"}


@app.post("/users/edit/{user_id}")
async def edit_user(user_id: str, user_update: UserUpdate):
    # Retrieve the current user data from the database
    user_response = supabase.table('users').select('*').eq('id', user_id).execute()

    if not user_response.data:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = user_response.data[0]

    # Prepare the updated fields
    updated_data = {**user_data}  # Start with the current data
    if user_update.firstName is not None:
        updated_data['firstName'] = user_update.firstName
    if user_update.lastName is not None:
        updated_data['lastName'] = user_update.lastName
    if user_update.email is not None:
        # Check if new email is already in use
        email_check_response = supabase.table('users').select('id').eq('email', user_update.email).execute()
        if email_check_response.data and email_check_response.data[0]['id'] != user_id:
            raise HTTPException(status_code=400, detail="Email already in use")
        updated_data['email'] = user_update.email
    if user_update.image is not None:
        updated_data['image'] = user_update.image

    # Update the user data in the database
    supabase.table('users').update(updated_data).eq('id', user_id).execute()

    return {"message": "User updated successfully"}
