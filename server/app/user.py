from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Base, engine, User, SessionLocal

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users/")
def create_user(name: str, email: str, password:str, db: Session = Depends(get_db)):
    db_user = User(name=name, email=email, password=password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/")
def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()
