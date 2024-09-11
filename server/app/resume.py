import os
from fastapi import UploadFile, File, HTTPException
from supabase import Client
from .models import Resume
import uuid

async def create_resume(file: UploadFile, user_id: str, supabase: Client):
    valid_file_types = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    
    if file.content_type not in valid_file_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF and DOCX files are allowed.")
    
    file_extension = file.filename.split('.')[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    
    try:
        file_content = await file.read()
        bucket_name = os.getenv("SUPABASE_BUCKET_NAME", "resumes")
        response = supabase.storage.from_(bucket_name).upload(unique_filename, file_content)
        
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to upload resume to storage")
        
        file_url = supabase.storage.from_(bucket_name).get_public_url(unique_filename)
        
        resume_data = Resume(user_id=user_id, file=file_url)
        db_response = supabase.table('resumes').insert({
            'user_id': resume_data.user_id,
            'file': resume_data.file
        }).execute()

        if db_response.error:
            raise HTTPException(status_code=500, detail="Failed to save resume information in the database")

        return {"message": "Resume uploaded successfully", "file_url": file_url}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while uploading the resume: {str(e)}")
