import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.fixture
def client():
    transport = ASGITransport(app=app)
    return AsyncClient(transport=transport, base_url="http://test")


@pytest.mark.asyncio
async def test_proxy_health_unknown_service(client):
    response = await client.get("/api/v1/proxy/health/nonexistent")
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_proxy_health_known_service(client):
    response = await client.get("/api/v1/proxy/health/agents")
    assert response.status_code in (200, 502)
