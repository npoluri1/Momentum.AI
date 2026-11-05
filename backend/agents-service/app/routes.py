import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import Agent, AgentSession, AgentMessage
from app.schemas import (
    AgentCreate, AgentUpdate, AgentResponse,
    SessionCreate, SessionResponse,
    MessageResponse, ChatRequest, ChatResponse,
    OrchestrationRequest, OrchestrationResponse,
    GenesisRequest, GenesisResponse,
)
from app.agents.agent_factory import AgentFactory
from app.agents.orchestrator import AgentOrchestrator
from app.agents.genesis_agent import GenesisAgent
from app.tools.tool_registry import ToolRegistry
from app.memory.conversation_memory import ConversationMemory
from app.memory.vector_store import vector_store
import httpx

router = APIRouter(prefix='/api/v1/agents', tags=['agents'])
session_router = APIRouter(prefix='/api/v1/sessions', tags=['sessions'])
chat_router = APIRouter(prefix='/api/v1/chat', tags=['chat'])
orchestrator = AgentOrchestrator()
conversation_memory = ConversationMemory()
genesis_agent = GenesisAgent()


@router.get('/providers', response_model=list[str])
async def get_providers():
    return AgentFactory.get_available_providers()


@router.get('/providers/{provider}/models', response_model=list[str])
async def get_models(provider: str):
    known_models = {
        'openai': ['gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
        'anthropic': [
            'claude-3-opus-20240229',
            'claude-3-sonnet-20240229',
            'claude-3-haiku-20240307',
            'claude-3-5-sonnet-20241022',
        ],
        'gemini': ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash'],
    }
    if provider.lower() in ('ollama', 'local'):
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.get('http://localhost:11434/v1/models')
                if resp.status_code == 200:
                    data = resp.json()
                    return [m['id'] for m in data.get('data', [])]
        except Exception:
            pass
        return []
    if provider.lower() not in known_models:
        return []
    return known_models[provider.lower()]
