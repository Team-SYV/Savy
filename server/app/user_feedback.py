from fastapi import HTTPException
from supabase import Client

from app.models import UserFeedbackCreate

def create_user_feedback(data: dict, supabase: Client):
    required_fields = ['user_id', 'rating', 'description']
    for field in required_fields:
        if not data.get(field):
            raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
    
    user_feedback = UserFeedbackCreate(
        user_id=data['user_id'],
        rating=data['rating'],
        description=data['description']
    )

    response = supabase.table('user_feedback').insert({
        'user_id': user_feedback.user_id,
        'rating': user_feedback.rating  ,
        'description':user_feedback.description
    }).execute()

    if hasattr(response, 'error') and response.error:
        raise HTTPException(status_code=500, detail="Failed to create user feedback")
    
    return {'id': response.data[0]['user_feedback_id']}