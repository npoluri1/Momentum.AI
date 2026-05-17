from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, Field


class AgentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    model_provider: str
    model_name: str
    system_prompt: Optional[str] = None
    temperature: float = 0.7
    max_tokens: int = 4096
    tools_enabled: Optional[list[str]] = None
    memory_config: Optional[dict[str, Any]] = None
    organization_id: str
    created_by: str


class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    model_provider: Optional[str] = None
    model_name: Optional[str] = None
    system_prompt: Optional[str] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    tools_enabled: Optional[list[str]] = None
    memory_config: Optional[dict[str, Any]] = None
    is_active: Optional[bool] = None


class AgentResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    model_provider: str
    model_name: str
    system_prompt: Optional[str] = None
    temperature: float
    max_tokens: int
    tools_enabled: Optional[list[str]] = None
    memory_config: Optional[dict[str, Any]] = None
    organization_id: str
    created_by: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SessionCreate(BaseModel):
    agent_id: str
    title: Optional[str] = None
    metadata_json: Optional[dict[str, Any]] = None
    created_by: str
    organization_id: str


class SessionResponse(BaseModel):
    id: str
    agent_id: str
    title: Optional[str] = None
    metadata_json: Optional[dict[str, Any]] = None
    organization_id: str
    created_by: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MessageResponse(BaseModel):
    id: str
    session_id: str
    role: str
    content: str
    tool_calls: Optional[list[Any]] = None
    tool_results: Optional[list[Any]] = None
    metadata_json: Optional[dict[str, Any]] = None
    tokens_used: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    session_id: str
    message: str
    stream: bool = False
    tools_enabled: Optional[list[str]] = None


class ChatResponse(BaseModel):
    session_id: str
    message: MessageResponse


class StreamChunk(BaseModel):
    session_id: str
    content: str
    finish_reason: Optional[str] = None


class TaskDelegation(BaseModel):
    task: str
    target_agent_id: str
    context: Optional[dict[str, Any]] = None


class OrchestrationRequest(BaseModel):
    primary_agent_id: str
    task: str
    sub_tasks: Optional[list[TaskDelegation]] = None
    chain: Optional[list[str]] = None
    context: Optional[dict[str, Any]] = None


class OrchestrationResponse(BaseModel):
    final_output: str
    intermediate_results: Optional[List[Dict[str, Any]]] = None


class GenesisRequest(BaseModel):
    prompt: str
    organization_id: str
    user_id: str


class GenesisResponse(BaseModel):
    success: bool
    project_id: str
    name: str
    domain: str
    message: str

