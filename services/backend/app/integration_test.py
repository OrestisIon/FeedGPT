from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app  # Adjust this import according to the actual location of your FastAPI application object
import pytest

client = TestClient(app)

@pytest.fixture
def mock_db_session():
    # This fixture would need to create and return a mock database session
    # You could use libraries like pytest-mock or unittest.mock here
    from unittest.mock import MagicMock
    return MagicMock(spec=Session)

@pytest.fixture
def authenticated_client():
    # Here you would set up a client that simulates an authenticated session.
    # This might involve overriding dependency injections in FastAPI to return a mock authenticated user.
    from fastapi import FastAPI
    from unittest.mock import patch

    app.dependency_overrides[app.your_auth_dependency] = lambda: MagicMock(user_id=123)
    yield TestClient(app)
    app.dependency_overrides.clear()

def test_register_user():
    response = client.post("/api/register", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "securepassword"
    })
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"
    
def test_update_user_details():
    headers = {'Authorization': 'Bearer yourtokenhere'}
    update_data = {
        "age": 30,
        "gender": "Non-binary",
        "occupation": "Developer",
        "country": "USA"
    }
    response = client.put("/api/users/me", json=update_data, headers=headers)
    assert response.status_code == 200
    updated_user = response.json()
    assert updated_user["age"] == 30
    assert updated_user["gender"] == "Non-binary"

def test_delete_user(authenticated_client, mock_db_session):
    with authenticated_client as ac:
        response = ac.post("/api/users/delete")
        assert response.status_code == 200
        assert response.json() == {"message": "User deleted successfully"}

def test_get_user_details(authenticated_client):
    with authenticated_client as ac:
        response = ac.get("/api/users/me")
        assert response.status_code == 200
        assert "email" in response.json()

def test_all_feeds(authenticated_client):
    with authenticated_client as ac:
        response = ac.get("/api/feeds")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

def test_add_feed(authenticated_client, mock_db_session):
    with authenticated_client as ac:
        response = ac.post("/api/feeds", json={"feed_url": "http://example.com/feed"})
        assert response.status_code == 200
        assert "message" in response.json()
        assert response.json()["message"] == "Feed added and scraped successfully"
        

def test_feed_recommendations():
    headers = {'Authorization': 'Bearer yourtokenhere'}
    response = client.get("/api/feeds/get_recommendations", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)  # Assuming it returns a list of recommendations

def test_get_feed_by_id():
    feed_id = 1  # Example feed ID
    headers = {'Authorization': 'Bearer yourtokenhere'}
    response =  client.get(f"/api/feeds/{feed_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()['id'] == feed_id
    
def test_delete_feed_subscription():
    feed_id = 1  # Example feed ID for deletion
    headers = {'Authorization': 'Bearer yourtokenhere'}
    response = client.post(f"/api/feeds/delete", json={"feed_id": feed_id}, headers=headers)
    assert response.status_code == 200
    assert response.json() == {"message": "Feed subscription deleted successfully."}

def test_list_all_feeds():
    headers = {'Authorization': 'Bearer yourtokenhere'}
    response =  client.get("/api/feeds", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)  # Assuming it returns a list of all feeds

def test_fetch_icon_by_id():
    icon_id = 100  # Example icon ID
    headers = {'Authorization': 'Bearer yourtokenhere'}
    response =  client.get(f"/api/icons/{icon_id}", headers=headers)
    assert response.status_code == 200
    assert 'url' in response.json()  # Assuming response includes URL of the icon


if __name__ == "__main__":
    pytest.main()
