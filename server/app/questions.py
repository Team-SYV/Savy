from fastapi import HTTPException
from supabase import Client

from app.models import QuestionsCreate

def create_questions(data: dict, supabase: Client):
    required_fields = ['job_information_id', 'question']
    for field in required_fields:
        if not data.get(field):
            raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
    
    # Assign the actual values from the data dictionary
    question = QuestionsCreate(
        job_information_id=data['job_information_id'],
        question=data['question']
    )

    response = supabase.table('questions').insert({
        'job_information_id': question.job_information_id,
        'question': question.question  
    }).execute()

    if hasattr(response, 'error') and response.error:
        raise HTTPException(status_code=500, detail="Failed to create question")
    
    return {"message": "Question created successfully"}
def get_questions(job_information_id: str, supabase: Client):
    response = supabase.table('questions').select("*").eq('job_information_id', job_information_id).execute()

    if hasattr(response, 'error') and response.error:
        raise HTTPException(status_code=500, detail="Failed to retrieve questions")
    
    if not response.data:
        raise HTTPException(status_code=404, detail="No questions found for the given job ID")

    return response.data
