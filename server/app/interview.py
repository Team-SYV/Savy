from typing import Optional
from pydantic import BaseModel
from fastapi import HTTPException
from supabase import Client

class InterviewCreate(BaseModel):
    user_id: str
    video: Optional[str] = None

def create_interview(interview_data: dict, supabase: Client):
    required_fields = ['user_id']
    for field in required_fields:
        if not interview_data.get(field):
            raise HTTPException(status_code=400, detail=f"Missing required field: {field}")

    interview_info = InterviewCreate(
        user_id=interview_data['user_id'],
        video=interview_data.get('video')  # Optional field
    )

    response = supabase.table('interviews').insert({
        'user_id': interview_info.user_id,
        'video': interview_info.video
    }).execute()

    if hasattr(response, 'error') and response.error:
        raise HTTPException(status_code=500, detail="Failed to create interview")

    return {"message": "Interview created successfully", "id": response.data[0]['id']}