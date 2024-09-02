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

if not url or not key:
    raise ValueError("Supabase URL and Key must be set in environment variables.")
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
    hashed_password = pwd_context.hash(user.password)
    try:
        response = supabase.table('users').insert({
            'firstName': user.firstName,
            'lastName': user.lastName,
            'email': user.email,
            'password': hashed_password,
            'image': user.image
        }).execute()

        if response.status_code == 201:
            return {"message": "User created successfully"}
        else:
            error_message = response.model_dump_json()
            print(f"Supabase API error: {error_message}")
            raise HTTPException(status_code=response.status_code, detail=error_message)
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/users/edit/")
async def update_user(user_id: str, user: UserUpdate):
    update_data = {k: v for k, v in user.model_dump().items() if v is not None}
    
    response = supabase.table('users').update(update_data).eq('id', user_id).execute()
    
    if response.status_code == 200:
        return {"message": "User updated successfully"}
    else:
        raise HTTPException(status_code=response.status_code, detail=response.model_dump_json())
