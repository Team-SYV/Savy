from flask.cli import load_dotenv
from sqlalchemy import Column, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
import cuid


load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=lambda: cuid.cuid())    
    firstName = Column(String, index=True, name='firstName')
    lastName = Column(String, index=True, name='lastName')
    email = Column(String, unique=True, index=True)
    password = Column(String, index=True)
    image = Column(String, index=True)
