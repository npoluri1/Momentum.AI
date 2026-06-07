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

router = APIRouter(prefix="/api/v1/agents", tags=["agents"])
session_router = APIRouter(prefix="/api/v1/sessions", tags=["sessions"])
chat_router = APIRouter(prefix="/api/v1/chat", tags=["chat"])
orchestrator = AgentOrchestrator()
conversation_memory = ConversationMemory()
genesis_agent = GenesisAgent()


@router.get("/providers", response_model=list[str])
async def get_providers():
    return AgentFactory.get_available_providers()


@router.get("/providers/{provider}/models", response_model=list[str])
async def get_models(provider: str):
    known_models = {
        "openai": ["gpt-4o", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"],
        "anthropic": [
            "claude-3-opus-20240229",
            "claude-3-sonnet-20240229",
            "claude-3-haiku-20240307",
            "claude-3-5-sonnet-20241022",
        ],
        "gemini": ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-flash"],
    }
    if provider.lower() not in known_models:
        raise HTTPException(status_code=404, detail=f"Unknown provider: {provider}")
    return known_models[provider.lower()]


@router.get("/tools", response_model=list[str])
async def get_tools():
    return list(ToolRegistry.get_all().keys())


@router.post("", response_model=AgentResponse, status_code=201)
async def create_agent(agent_data: AgentCreate, db: Session = Depends(get_db)):
    agent = Agent(
        name=agent_data.name,
        description=agent_data.description,
        model_provider=agent_data.model_provider,
        model_name=agent_data.model_name,
        system_prompt=agent_data.system_prompt,
        temperature=agent_data.temperature,
        max_tokens=agent_data.max_tokens,
        tools_enabled=agent_data.tools_enabled,
        memory_config=agent_data.memory_config,
        organization_id=agent_data.organization_id,
        created_by=agent_data.created_by,
    )
    db.add(agent)
    db.commit()
    db.refresh(agent)
    return agent


@router.get("", response_model=list[AgentResponse])
async def list_agents(
    organization_id: str = Query(...),
    is_active: Optional[bool] = None,
    model_provider: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Agent).filter(Agent.organization_id == organization_id)
    if is_active is not None:
        query = query.filter(Agent.is_active == is_active)
    if model_provider:
        query = query.filter(Agent.model_provider == model_provider)
    agents = query.order_by(desc(Agent.created_at)).all()
    return agents


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(agent_id: str, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent


@router.patch("/{agent_id}", response_model=AgentResponse)
async def update_agent(agent_id: str, agent_data: AgentUpdate, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    update_data = agent_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(agent, field, value)

    db.commit()
    db.refresh(agent)
    return agent


@router.delete("/{agent_id}", status_code=204)
async def delete_agent(agent_id: str, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    db.delete(agent)
    db.commit()


@session_router.post("", response_model=SessionResponse, status_code=201)
async def create_session(session_data: SessionCreate, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == session_data.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    session = AgentSession(
        agent_id=session_data.agent_id,
        title=session_data.title,
        metadata_json=session_data.metadata_json,
        organization_id=session_data.organization_id,
        created_by=session_data.created_by,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@session_router.get("", response_model=list[SessionResponse])
async def list_sessions(
    agent_id: str = Query(...),
    organization_id: str = Query(...),
    db: Session = Depends(get_db),
):
    sessions = (
        db.query(AgentSession)
        .filter(
            AgentSession.agent_id == agent_id,
            AgentSession.organization_id == organization_id,
        )
        .order_by(desc(AgentSession.created_at))
        .all()
    )
    return sessions


@session_router.get("/{session_id}", response_model=SessionResponse)
async def get_session(session_id: str, db: Session = Depends(get_db)):
    session = db.query(AgentSession).filter(AgentSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@session_router.get("/{session_id}/messages", response_model=list[MessageResponse])
async def get_session_messages(session_id: str, db: Session = Depends(get_db)):
    session = db.query(AgentSession).filter(AgentSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    messages = (
        db.query(AgentMessage)
        .filter(AgentMessage.session_id == session_id)
        .order_by(AgentMessage.created_at)
        .all()
    )
    return messages


@chat_router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    session = db.query(AgentSession).filter(AgentSession.id == request.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    agent = db.query(Agent).filter(Agent.id == session.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    agent_instance = AgentFactory.create_agent(
        provider=agent.model_provider,
        agent_id=agent.id,
        name=agent.name,
        model_name=agent.model_name,
        system_prompt=agent.system_prompt,
        temperature=agent.temperature,
        max_tokens=agent.max_tokens,
        tools_enabled=agent.tools_enabled,
        memory_config=agent.memory_config,
    )

    tools_to_use = None
    if agent.tools_enabled:
        tools_to_use = ToolRegistry.to_openai_tools(agent.tools_enabled)

    history = await conversation_memory.get_context(request.session_id)
    history.append({"role": "user", "content": request.message})

    response = await agent_instance.chat(history, tools=tools_to_use)

    user_msg = AgentMessage(
        session_id=request.session_id,
        role="user",
        content=request.message,
    )
    assistant_msg = AgentMessage(
        session_id=request.session_id,
        role="assistant",
        content=response.content,
        tool_calls=response.tool_calls,
        tokens_used=response.tokens_used,
    )
    db.add(user_msg)
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)

    await conversation_memory.add_message(request.session_id, "user", request.message)
    await conversation_memory.add_message(
        request.session_id,
        "assistant",
        response.content,
    )

    return ChatResponse(
        session_id=request.session_id,
        message=assistant_msg,
    )


@chat_router.post("/orchestrate", response_model=OrchestrationResponse)
async def orchestrate(request: OrchestrationRequest, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == request.primary_agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Primary agent not found")

    primary_agent = AgentFactory.create_agent(
        provider=agent.model_provider,
        agent_id=agent.id,
        name=agent.name,
        model_name=agent.model_name,
        system_prompt=agent.system_prompt,
        temperature=agent.temperature,
        max_tokens=agent.max_tokens,
        tools_enabled=agent.tools_enabled,
        memory_config=agent.memory_config,
    )

    result = await orchestrator.execute_task(
        primary_agent=primary_agent,
        task=request.task,
        sub_tasks=request.sub_tasks,
        chain=request.chain,
        context=request.context,
    )
    return result


@chat_router.post("/memory/search")
async def search_memory(
    query: str,
    session_id: Optional[str] = None,
    n_results: int = 5,
):
    filter_dict = None
    if session_id:
        filter_dict = {"session_id": session_id}
    results = await vector_store.search(
        query=query,
        n_results=n_results,
        filter_dict=filter_dict,
    )
    return {"results": results}


@chat_router.post("/memory/store")
async def store_memory(
    content: str,
    session_id: Optional[str] = None,
    metadata: Optional[dict] = None,
):
    meta = metadata or {}
    if session_id:
        meta["session_id"] = session_id
    doc_id = await vector_store.add_document(content=content, metadata=meta)
    return {"document_id": doc_id}


from app.services.resource_provisioner import ResourceProvisioner

@chat_router.post("/genesis", response_model=GenesisResponse)
async def genesis(request: GenesisRequest, db: Session = Depends(get_db)):
    try:
        # 1. Generate the system design
        system_design = await genesis_agent.generate_system(request.prompt)
        
        # 2. Provision Resources
        provisioner = ResourceProvisioner(db)
        project_id = await provisioner.provision_system(
            design=system_design,
            organization_id=request.organization_id,
            user_id=request.user_id
        )
        
        return GenesisResponse(
            success=True,
            project_id=project_id,
            name=system_design.name,
            domain=system_design.domain,
            message=f"System '{system_design.name}' for {system_design.domain} successfully designed and provisioned with {len(system_design.agents)} agents, {len(system_design.task_lists)} task lists, and {len(system_design.workflows)} workflows."
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
