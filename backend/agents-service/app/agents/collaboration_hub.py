from typing import List, Dict, Any

class AgentCollaborationHub:
    def __init__(self):
        self.shared_memory = {}
        self.active_agents = {}

    def register_agent(self, agent_id: str, agent_config: Dict[str, Any]):
        self.active_agents[agent_id] = agent_config
        print(f"Agent {agent_id} joined the collaboration hub.")

    def broadcast_message(self, sender_id: str, message: str, targets: List[str] = None):
        """Standardized communication protocol between agents."""
        for agent_id in self.active_agents:
            if targets is None or agent_id in targets:
                if agent_id != sender_id:
                    self._deliver_message(agent_id, sender_id, message)

    def _deliver_message(self, target_id, sender_id, message):
        # In production, this would integrate with a Message Broker (RabbitMQ/Redis)
        print(f"Message from {sender_id} to {target_id}: {message}")

    def update_shared_memory(self, key: str, value: Any):
        self.shared_memory[key] = value

    def get_shared_context(self) -> Dict[str, Any]:
        return self.shared_memory
