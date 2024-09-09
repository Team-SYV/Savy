# jobInformation.py
from fastapi import HTTPException
from supabase import Client
from .models import JobInformation

# Create a new job description
def create_job_information(job_data: dict, supabase: Client):
    # Validate the required fields in the job_data
    required_fields = ['user_id', 'industry', 'role', 'type', 'experience', 'company_name', 'job_description']
    for field in required_fields:
        if not job_data.get(field):
            raise HTTPException(status_code=400, detail=f"Missing required field: {field}")

    # Create JobInformation model
    job_info = JobInformation(
        user_id=job_data['user_id'],
        industry=job_data['industry'],
        role=job_data['role'],
        type=job_data['type'],
        experience=job_data['experience'],
        company_name=job_data['company_name'],
        job_description=job_data['job_description']
    )

    # Insert the job information into the "job_information" table
    response = supabase.table('job_information').insert({
        'user_id': job_info.user_id,
        'industry': job_info.industry,
        'role': job_info.role,
        'type': job_info.type,
        'experience': job_info.experience,
        'company_name': job_info.company_name,
        'job_description': job_info.job_description
    }).execute()

    if response.error:
        raise HTTPException(status_code=500, detail="Failed to create job description")

    return {"message": "Job information created successfully"}
