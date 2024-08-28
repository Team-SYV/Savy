from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from models import Base, engine, User, SessionLocal
from passlib.context import CryptContext  

Base.metadata.create_all(bind=engine)

app = FastAPI()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users/")
def create_user(firstName: str, lastName: str, email: str, password: str, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(password)  
    db_user = User(firstName=firstName, lastName=lastName, email=email, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
