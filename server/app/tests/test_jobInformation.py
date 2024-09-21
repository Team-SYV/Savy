import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException
from app.jobInformation import create_job_information

@pytest.fixture
def mock_supabase_client():
    # Create a mock Supabase client
    return MagicMock()

def test_create_job_information_success(mock_supabase_client):
    # Sample job data to test
    job_data = {
        'user_id': '123',
        'industry': 'Technology',
        'role': 'Software Engineer',
        'type': 'Full-time',
        'experience': '3 years',
        'company_name': 'Tech Corp',
        'job_description': 'Developing software applications'
    }

    # Mock the response for a successful insert with a fake ID
    mock_supabase_client.table().insert().execute.return_value = MagicMock(
        error=None, 
        data=[{'id': 'mocked_id'}]  # Simulate the returned ID
    )

    # Call the function with the valid data
    result = create_job_information(job_data, mock_supabase_client)

    # Assert that the function returns the expected result
    assert result["message"] == "Job information created successfully"
    assert "id" in result  # We don't care what the exact ID is in this case, just that it's present

def test_create_job_information_missing_field(mock_supabase_client):
    # Sample job data with a missing field (e.g., 'role' is missing)
    job_data = {
        'user_id': '123',
        'industry': 'Technology',
        'type': 'Full-time',
        'experience': '3 years',
        'company_name': 'Tech Corp',
        'job_description': 'Developing software applications'
    }

    # Call the function and expect it to raise an HTTPException for the missing field
    with pytest.raises(HTTPException) as exc_info:
        create_job_information(job_data, mock_supabase_client)

    # Assert that the exception has the correct status code and detail
    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "Missing required field: role"

def test_create_job_information_supabase_error(mock_supabase_client):
    # Sample valid job data
    job_data = {
        'user_id': '123',
        'industry': 'Technology',
        'role': 'Software Engineer',
        'type': 'Full-time',
        'experience': '3 years',
        'company_name': 'Tech Corp',
        'job_description': 'Developing software applications'
    }

    # Mock the response to simulate a Supabase insert error
    mock_supabase_client.table().insert().execute.return_value = MagicMock(error="Some error")

    # Call the function and expect it to raise an HTTPException for Supabase error
    with pytest.raises(HTTPException) as exc_info:
        create_job_information(job_data, mock_supabase_client)

    # Assert that the exception has the correct status code and detail
    assert exc_info.value.status_code == 500
    assert exc_info.value.detail == "Failed to create job description"
