import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.fixture
def client():
    transport = ASGITransport(app=app)
    return AsyncClient(transport=transport, base_url="http://test")


@pytest.mark.asyncio
async def test_list_agents(client):
    response = await client.get("/api/v1/agents")
    assert response.status_code in (200, 401)


@pytest.mark.asyncio
async def test_list_providers(client):
    response = await client.get("/api/v1/agents/providers")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
