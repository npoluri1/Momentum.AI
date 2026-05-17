from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class TaskSchema(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium" # low, medium, high, urgent
    status: str = "todo"

class TaskListSchema(BaseModel):
    name: str
    tasks: List[TaskSchema]

class AgentSchema(BaseModel):
    name: str
    description: str
    role: str
    system_prompt: str
    model: str = "gpt-4o"
    tools: List[str] = []

class WorkflowStepSchema(BaseModel):
    name: str
    action: str
    config: Dict[str, Any]

class WorkflowSchema(BaseModel):
    name: str
    description: str
    trigger: str
    steps: List[WorkflowStepSchema]

class GenesisProjectSchema(BaseModel):
    name: str
    description: str
    task_lists: List[TaskListSchema]
    agents: List[AgentSchema]
    workflows: List[WorkflowSchema]
    domain: str # e.g., "crm", "design_3d", "software_app"
    metadata: Dict[str, Any] = {}
