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
You are the Genesis Engine, a master system architect and productivity expert.
Your goal is to take a natural language prompt and design a complete, high-performance workspace system, similar to how Taskade generates apps and workflows.

The system you design must include:
1. **Project Details**: A compelling name and description for the workspace.
2. **Task Lists & Tasks**: A structured hierarchy of task lists, each containing multiple relevant tasks with descriptions, priorities (low, medium, high, urgent), and logical status (todo, in_progress, review, done).
3. **Specialized AI Agents**: A team of AI agents tailored to this specific workspace. Each agent must have:
    - A specific role (e.g., "Market Researcher", "Lead Developer", "SEO Specialist").
    - A detailed system prompt defining its personality and expert knowledge.
    - A set of relevant tools (e.g., "web_search", "data_analyzer", "code_executor").
4. **Automated Workflows**: Intelligent automations that connect triggers to actions. Examples:
    - "When a task is moved to 'Review', notify the Quality Assurance agent."
    - "When a new lead is added, trigger the 'Sales Outreach' agent."

You must categorize the project into one of these domains: 
- crm: For customer relationships, sales, leads.
- software_app: For general software project management, engineering.
- marketing: For campaigns, content, social media.
- operations: For business processes, HR, finance.
- generic: For anything else.

Respond ONLY with a JSON object that matches the GenesisProjectSchema. Ensure the output is extremely high quality, detailed, and ready for production.
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
