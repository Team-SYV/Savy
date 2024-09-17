from fastapi import HTTPException
from supabase import Client
from .models import JobInformationCreate, JobInformationUpdate

def create_job_information(job_data: dict, supabase: Client):
    required_fields = ['user_id', 'industry', 'role', 'type', 'experience', 'company_name', 'job_description']
    for field in required_fields:
        if not job_data.get(field):
            raise HTTPException(status_code=400, detail=f"Missing required field: {field}")

    job_info = JobInformationCreate(
        user_id=job_data['user_id'],
        industry=job_data['industry'],
        role=job_data['role'],
        type=job_data['type'],
        experience=job_data['experience'],
        company_name=job_data['company_name'],
        job_description=job_data['job_description']
    )

    response = supabase.table('job_information').insert({
        'user_id': job_info.user_id,
        'industry': job_info.industry,
        'role': job_info.role,
        'type': job_info.type,
        'experience': job_info.experience,
        'company_name': job_info.company_name,
        'job_description': job_info.job_description
    }).execute()

    if hasattr(response, 'error') and response.error:
        raise HTTPException(status_code=500, detail="Failed to create job description")

    return {"message": "Job information created successfully", "id": response.data[0]['id']}

def update_job_information_with_resume(resume_data: dict, supabase: Client):
    required_fields = ['id', 'resume']
    for field in required_fields:
        if not resume_data.get(field):
            raise HTTPException(status_code=400, detail=f"Missing required field: {field}")

    job_update = JobInformationUpdate(
        id=resume_data['id'],
        resume=resume_data['resume']  
    )

    response = supabase.table('job_information').update({
        'resume': job_update.resume
    }).eq('id', job_update.id).execute()

    if hasattr(response, 'error') and response.error:
        raise HTTPException(status_code=500, detail="Failed to update resume")

    return {"message": "Resume updated successfully"}
