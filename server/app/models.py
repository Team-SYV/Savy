from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    user_id: str
    first_name: str
    last_name: str
    email: str
    image: Optional[str] = None

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    image: Optional[str] = None
    last_interview: Optional[datetime]= None
    total_score: Optional[str] = None

class UserFeedbackCreate(BaseModel):
    user_id: str
    rating: float
    description: str

class InterviewCreate(BaseModel):
    user_id: str
    type: str
    streak_count: Optional[float] = None

class JobInformationCreate(BaseModel):
    interview_id: str
    industry: str
    job_role: str
    interview_type: str
    experience_level: str
    company_name:Optional [str] = None
    job_description: Optional [str] = None

class QuestionsCreate(BaseModel):
    job_information_id: str
    question: str

class AnswerCreate(BaseModel):
    question_id: str
    answer: str

class FeedbackCreate(BaseModel):
    answer_id: str
    interview_id: str
    answer_relevance: str
    eye_contact: str
    grammar: str
    pace_of_speech: str
    filler_words: str
    tips: str

class RatingsCreate(BaseModel):
    feedback_id: str
    answer_relevance: float
    eye_contact: float
    grammar: float
    pace_of_speech: float
    filler_words: float


