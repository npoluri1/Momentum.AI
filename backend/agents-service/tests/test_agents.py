import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.agents.agent_factory import AgentFactory
from app.agents.base_agent import BaseAgent


@pytest.fixture
def client():
    transport = ASGITransport(app=app)
    return AsyncClient(transport=transport, base_url="http://test")


@pytest.mark.asyncio
async def test_health_check(client):
    response = await client.get("/health")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_agent_factory_invalid_provider():
    agent = AgentFactory.create_agent("nonexistent", {})
    assert agent is None


@pytest.mark.asyncio
async def test_agent_factory_openai():
    agent = AgentFactory.create_agent("openai", {
        "model": "gpt-4o",
        "temperature": 0.7,
        "system_prompt": "You are a test assistant",
    })
    assert agent is not None
    assert isinstance(agent, BaseAgent)
    assert agent.model == "gpt-4o"
    assert agent.temperature == 0.7
    assert agent.system_prompt == "You are a test assistant"


@pytest.mark.asyncio
async def test_agent_factory_anthropic():
    agent = AgentFactory.create_agent("anthropic", {
        "model": "claude-3-opus",
        "temperature": 0.5,
        "system_prompt": "You are Claude",
    })
    assert agent is not None
    assert isinstance(agent, BaseAgent)
    assert agent.model == "claude-3-opus"


@pytest.mark.asyncio
async def test_agent_factory_gemini():
    agent = AgentFactory.create_agent("gemini", {
        "model": "gemini-1.5-pro",
    })
    assert agent is not None
    assert isinstance(agent, BaseAgent)
    assert agent.model == "gemini-1.5-pro"
