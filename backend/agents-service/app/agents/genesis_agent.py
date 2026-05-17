import json
from typing import Optional
from app.agents.base_agent import BaseAgent
from app.agents.openai_agent import OpenAIAgent
from app.agents.genesis_schemas import GenesisProjectSchema


class GenesisAgent:
    def __init__(self, provider: str = "openai", model_name: str = "gpt-4o"):
        self.provider = provider
        self.model_name = model_name
        self.system_prompt = """
You are the Genesis Engine, a master system architect. 
Your goal is to take a natural language prompt and design a complete workspace system.
This includes:
1. A project structure (task lists and tasks).
2. Specialized AI agents with specific roles and system prompts.
3. Workflow automations with triggers and steps.

You must categorize the project into one of these domains: 
- crm: For customer relationships, sales, leads.
- design_3d: For mechanical, electrical, or civil engineering designs.
- software_app: For general software project management.
- generic: For anything else.

If the domain is 'design_3d', ensure you include a '3D Designer' agent with access to 'design_3d' tool.

Respond ONLY with a JSON object that matches the GenesisProjectSchema.
"""

    async def generate_system(self, prompt: str) -> GenesisProjectSchema:
        # We'll use the OpenAIAgent as the underlying driver for Genesis for now
        # because of its strong instruction following for complex schemas.
        agent = OpenAIAgent(
            agent_id="genesis-engine",
            name="Genesis Engine",
            model_name=self.model_name,
            system_prompt=self.system_prompt,
        )

        messages = [
            {"role": "user", "content": f"Generate a complete system for: {prompt}"}
        ]

        response = await agent.chat(messages, response_format={"type": "json_object"})
        
        try:
            data = json.loads(response.content)
            return GenesisProjectSchema(**data)
        except Exception as e:
            # Fallback or error handling
            raise ValueError(f"Failed to generate valid genesis schema: {str(e)}")
