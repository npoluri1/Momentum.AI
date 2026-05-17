from pydantic import BaseModel
from typing import List, Optional

class AgentListing(BaseModel):
    agent_id: str
    creator_pod_id: str
    domain: str
    reputation_score: float # 0.0 to 1.0
    license_type: str

class IntelligenceMarketplaceService:
    def list_agents(self, domain: Optional[str] = None) -> List[AgentListing]:
        # Return a list of available AI agents from the registry
        return [
            AgentListing(
                agent_id="Energy-Opt-Alpha",
                creator_pod_id="Nation-X",
                domain="Energy",
                reputation_score=0.98,
                license_type="Sovereign-Shared"
            )
        ]

    def acquire_agent(self, agent_id: str):
        # Trigger license verification and secure deployment protocol
        return {"status": "success", "message": f"Agent {agent_id} securely deployed into your sovereign pod."}
