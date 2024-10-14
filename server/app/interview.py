from fastapi import HTTPException
from supabase import Client
from app.models import InterviewCreate

def create_interview(interview_data: dict, supabase: Client):
    required_fields = ['user_id', 'type']
    for field in required_fields:
        if not interview_data.get(field):
            raise HTTPException(status_code=400, detail=f"Missing required field: {field}")

    interview_info = InterviewCreate(
        user_id=interview_data['user_id'],
        type=interview_data['type'],
        streak_count=interview_data.get('streak_count', 0) 
    )

    response = supabase.table('interview').insert({
        'user_id': interview_info.user_id,
        'type': interview_info.type,
        'streak_count': interview_info.streak_count  
    }).execute()

    if hasattr(response, 'error') and response.error:
        raise HTTPException(status_code=500, detail="Failed to create interview")

    return response.data[0]['interview_id']
