from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Base, engine, User, SessionLocal
from passlib.context import CryptContext  
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

Base.metadata.create_all(bind=engine)

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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = pwd_context.hash(user.password)  
    new_user = User(
        firstName=user.firstName, 
        lastName=user.lastName, 
        email=user.email, 
        password=hashed_password,
        image=user.image,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/users/edit/")
def edit_user(user_id: str, user: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.firstName:
        db_user.firstName = user.firstName
    if user.lastName:
        db_user.lastName = user.lastName
    if user.email:
        db_user.email = user.email
    if user.image:
        db_user.image = user.image
    
    db.commit()
    db.refresh(db_user)
    return db_user
