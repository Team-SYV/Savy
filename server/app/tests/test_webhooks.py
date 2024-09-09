import json
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from svix.webhooks import WebhookVerificationError

from app.main import app

client = TestClient(app)

# Mock webhook secret for testing
webhook_secret = "test_secret"

@pytest.fixture
def mock_supabase():
    with patch('app.webhooks.Client') as mock_client:
        yield mock_client

@pytest.fixture
def valid_headers():
    return {
        "svix-id": "test-id",
        "svix-signature": "test-signature",
        "svix-timestamp": "test-timestamp",
    }

@pytest.fixture
def valid_payload():
    return {
        "type": "user.created",
        "data": {
            "id": "user_123",
            "first_name": "John",
            "last_name": "Doe",
            "email_addresses": [{"email_address": "john.doe@example.com"}],
            "profile_image_url": "https://example.com/image.jpg",
        }
    }

# Mock the webhook verification
@patch('app.webhooks.Webhook.verify')
def test_webhook_user_created(mock_verify, valid_headers, valid_payload, mock_supabase):
    # Mock successful verification
    mock_verify.return_value = None

    # Mock database response for no existing user
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []

    response = client.post(
        "/api/webhooks/",
        headers=valid_headers,
        data=json.dumps(valid_payload)
    )

    # Check response
    assert response.status_code == 204
    assert mock_supabase.table.return_value.insert.called_once()

# Test for invalid webhook signature
@patch('app.webhooks.Webhook.verify', side_effect=WebhookVerificationError)
def test_webhook_invalid_signature(mock_verify, valid_headers, valid_payload):
    response = client.post(
        "/api/webhooks/",
        headers=valid_headers,
        data=json.dumps(valid_payload)
    )

    # Check that it returns 400 due to invalid signature
    assert response.status_code == 400
    assert response.json() == {"error": "Invalid webhook signature", "details": ""}

# Test missing headers
def test_webhook_missing_headers(valid_payload):
    response = client.post(
        "/api/webhooks/",
        headers={},  # Sending empty headers
        data=json.dumps(valid_payload)
    )

    # Check that it returns 400 due to missing headers
    assert response.status_code == 400
    assert response.json() == {"error": "Missing required headers"}

# Test user update event
@patch('app.webhooks.Webhook.verify')
def test_webhook_user_updated(mock_verify, valid_headers, mock_supabase):
    mock_verify.return_value = None

    # Simulate user update payload
    updated_payload = {
        "type": "user.updated",
        "data": {
            "id": "user_123",
            "first_name": "Johnny",
            "last_name": "Doe",
            "email_addresses": [{"email_address": "johnny.doe@example.com"}],
            "profile_image_url": "https://example.com/new_image.jpg",
        }
    }

    # Mock database response for existing user
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
        {
            "id": "user_123",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com",
            "image": "https://example.com/image.jpg"
        }
    ]

    response = client.post(
        "/api/webhooks/",
        headers=valid_headers,
        data=json.dumps(updated_payload)
    )

    # Check response
    assert response.status_code == 204
    assert mock_supabase.table.return_value.update.called_once()

# Test user deletion event
@patch('app.webhooks.Webhook.verify')
def test_webhook_user_deleted(mock_verify, valid_headers, mock_supabase):
    mock_verify.return_value = None

    # Simulate user deletion payload
    delete_payload = {
        "type": "user.deleted",
        "data": {
            "id": "user_123"
        }
    }

    response = client.post(
        "/api/webhooks/",
        headers=valid_headers,
        data=json.dumps(delete_payload)
    )

    # Check response
    assert response.status_code == 204
    assert mock_supabase.table.return_value.delete.called_once()
