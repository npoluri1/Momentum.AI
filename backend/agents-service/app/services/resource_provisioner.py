import httpx
import logging
from typing import List, Dict, Any
from app.agents.genesis_schemas import GenesisProjectSchema
from app.models import Agent
from app.config import settings

logger = logging.getLogger(__name__)

class ResourceProvisioner:
    def __init__(self, db_session):
        self.db = db_session
        self.crm_base_url = "http://crm-service:8002/api/v1" # Internal Docker URL
        self.workflow_base_url = "http://workflow-engine:8003/api/v1"

    async def provision_system(self, design: GenesisProjectSchema, organization_id: str, user_id: str) -> str:
        """
        Provisions all resources defined in the Genesis design.
        Returns the created project_id.
        """
        # 1. Create Project in CRM
        project_id = await self._create_crm_project(design, organization_id, user_id)
        
        # 2. Create Task Lists and Tasks in CRM
        if project_id:
            await self._create_crm_tasks(project_id, design.task_lists, organization_id, user_id)
        
        # 3. Create Agents locally in Agents Service
        await self._create_agents(design.agents, organization_id, user_id)
        
        # 4. Create Workflows in Workflow Engine
        await self._create_workflows(project_id, design.workflows, organization_id)
        
        return project_id or "local-project-id"

    async def _create_crm_project(self, design: GenesisProjectSchema, organization_id: str, user_id: str) -> str:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.crm_base_url}/projects/",
                    json={
                        "name": design.name,
                        "description": design.description,
                        "organization": organization_id,
                        "owner": user_id,
                        "status": "active"
                    },
                    timeout=10.0
                )
                if response.status_code == 201:
                    data = response.json()
                    return str(data.get("id"))
                else:
                    logger.error(f"Failed to create CRM project: {response.text}")
                    return ""
        except Exception as e:
            logger.error(f"Error calling CRM service: {str(e)}")
            return ""

    async def _create_crm_tasks(self, project_id: str, task_lists: List[Any], organization_id: str, user_id: str):
        try:
            async with httpx.AsyncClient() as client:
                for tlist in task_lists:
                    # Create Task List
                    tl_resp = await client.post(
                        f"{self.crm_base_url}/projects/{project_id}/task-lists/",
                        json={
                            "name": tlist.name,
                            "project": project_id,
                            "order": 0
                        }
                    )
                    if tl_resp.status_code == 201:
                        tl_id = tl_resp.json().get("id")
                        # Create Tasks
                        for task in tlist.tasks:
                            await client.post(
                                f"{self.crm_base_url}/projects/{project_id}/tasks/",
                                json={
                                    "title": task.title,
                                    "description": task.description or "",
                                    "status": task.status,
                                    "priority": task.priority,
                                    "project": project_id,
                                    "task_list": tl_id,
                                    "organization": organization_id,
                                    "created_by": user_id
                                }
                            )
        except Exception as e:
            logger.error(f"Error creating CRM tasks: {str(e)}")

    async def _create_agents(self, agents: List[Any], organization_id: str, user_id: str):
        for agent_data in agents:
            agent = Agent(
                name=agent_data.name,
                description=agent_data.description,
                model_provider="openai",
                model_name=agent_data.model,
                system_prompt=agent_data.system_prompt,
                tools_enabled=agent_data.tools,
                organization_id=organization_id,
                created_by=user_id,
            )
            self.db.add(agent)
        self.db.commit()

    async def _create_workflows(self, project_id: str, workflows: List[Any], organization_id: str):
        try:
            async with httpx.AsyncClient() as client:
                for wf in workflows:
                    await client.post(
                        f"{self.workflow_base_url}/workflows",
                        json={
                            "name": wf.name,
                            "description": wf.description,
                            "trigger": wf.trigger,
                            "steps": [step.model_dump() for step in wf.steps],
                            "project_id": project_id,
                            "organization_id": organization_id
                        }
                    )
        except Exception as e:
            logger.error(f"Error calling Workflow engine: {str(e)}")
