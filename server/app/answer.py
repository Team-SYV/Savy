from fastapi import HTTPException
from supabase import Client

from app.models import AnswerCreate

def create_answer(data: dict, supabase: Client):
    required_fields = ['question_id', 'answer']
    for field in required_fields:
        if not data.get(field):
            raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
    answer = AnswerCreate(
        question_id=data['question_id'],
        answer=data['answer']
    )

    response = supabase.table('answer').insert({
        'question_id': answer.question_id,
        'answer': answer.answer
    }).execute()

    if hasattr(response, 'error') and response.error:
        raise HTTPException(status_code=500, detail="Failed to create question")

    return response.data[0]['question_id']


