from typing import Optional
from app.agents.base_agent import BaseAgent
from app.agents.openai_agent import OpenAIAgent
from app.agents.anthropic_agent import AnthropicAgent
from app.agents.gemini_agent import GeminiAgent


class AgentFactory:
    _providers = {
        "openai": OpenAIAgent,
        "anthropic": AnthropicAgent,
        "gemini": GeminiAgent,
    }

    @classmethod
    def register_provider(cls, name: str, agent_class: type):
        cls._providers[name] = agent_class

    @classmethod
    def create_agent(
        cls,
        provider: str,
        agent_id: str,
        name: str,
        model_name: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 4096,
        tools_enabled: Optional[list[str]] = None,
        memory_config: Optional[dict] = None,
        **kwargs,
    ) -> BaseAgent:
        provider_lower = provider.lower()
        if provider_lower not in cls._providers:
            raise ValueError(
                f"Unsupported provider: '{provider}'. Available: {list(cls._providers.keys())}"
            )

        agent_class = cls._providers[provider_lower]
        return agent_class(
            agent_id=agent_id,
            name=name,
            model_name=model_name,
            system_prompt=system_prompt,
            temperature=temperature,
            max_tokens=max_tokens,
            tools_enabled=tools_enabled,
            memory_config=memory_config,
            **kwargs,
        )

    @classmethod
    def get_available_providers(cls) -> list[str]:
        return list(cls._providers.keys())

    @classmethod
    def validate_provider_model(cls, provider: str, model_name: str) -> bool:
        provider = provider.lower()
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
        if provider not in known_models:
            return False
        return model_name in known_models[provider]
