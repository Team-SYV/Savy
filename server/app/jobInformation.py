from fastapi import HTTPException
from supabase import Client
from .models import JobInformationCreate

def create_job_information(job_data: dict, supabase: Client):
    required_fields = ['interview_id', 'industry', 'job_role', 'interview_type', 'experience_level']
    for field in required_fields:
        if not job_data.get(field):
            raise HTTPException(status_code=400, detail=f"Missing required field: {field}")

    job_info = JobInformationCreate(
        interview_id=job_data['interview_id'],
        industry=job_data['industry'],
        job_role=job_data['job_role'],
        interview_type=job_data['interview_type'],
        experience_level=job_data['experience_level'],
        company_name=job_data['company_name'],
        job_description=job_data['job_description']
    )

    response = supabase.table('job_information').insert({
        'interview_id': job_info.interview_id,
        'industry': job_info.industry,
        'job_role': job_info.job_role,
        'interview_type': job_info.interview_type,
        'experience_level': job_info.experience_level,
        'company_name': job_info.company_name,
        'job_description': job_info.job_description
    }).execute()

    if hasattr(response, 'error') and response.error:
        raise HTTPException(status_code=500, detail="Failed to create job description")

    return  {'id':response.data[0]['job_information_id']}

def get_job_information(job_id: str, supabase: Client):
    response = supabase.table('job_information').select('*').eq('job_information_id', job_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Job information not found")

    if hasattr(response, 'error') and response.error:
        raise HTTPException(status_code=500, detail="Failed to retrieve job information")

    return response.data[0]
