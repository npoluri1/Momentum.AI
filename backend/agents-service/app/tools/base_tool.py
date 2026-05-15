from abc import ABC, abstractmethod
from typing import Any, Optional


class BaseTool(ABC):
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description

    @abstractmethod
    async def execute(self, **kwargs) -> Any:
        pass

    @abstractmethod
    def to_openai_format(self) -> dict:
        pass

    @abstractmethod
    def to_anthropic_format(self) -> dict:
        pass

    @abstractmethod
    def to_gemini_format(self) -> dict:
        pass
