from abc import ABC, abstractmethod
from typing import Optional, AsyncIterator
from app.schemas import MessageResponse


class BaseAgent(ABC):
    def __init__(
        self,
        agent_id: str,
        name: str,
        model_name: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 4096,
        tools_enabled: Optional[list[str]] = None,
        memory_config: Optional[dict] = None,
    ):
        self.agent_id = agent_id
        self.name = name
        self.model_name = model_name
        self.system_prompt = system_prompt
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.tools_enabled = tools_enabled or []
        self.memory_config = memory_config or {}

    @abstractmethod
    async def chat(
        self,
        messages: list[dict],
        tools: Optional[list[dict]] = None,
    ) -> MessageResponse:
        pass

    @abstractmethod
    async def chat_stream(
        self,
        messages: list[dict],
        tools: Optional[list[dict]] = None,
    ) -> AsyncIterator[str]:
        pass

    @abstractmethod
    async def analyze(
        self,
        prompt: str,
        context: Optional[dict] = None,
    ) -> str:
        pass

    @abstractmethod
    def get_model_config(self) -> dict:
        pass
