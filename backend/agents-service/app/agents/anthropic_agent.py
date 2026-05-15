from typing import Optional, AsyncIterator
from anthropic import AsyncAnthropic
from app.agents.base_agent import BaseAgent
from app.config import settings
from app.schemas import MessageResponse
from datetime import datetime, timezone


class AnthropicAgent(BaseAgent):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        api_key = kwargs.get("api_key") or settings.anthropic_api_key
        self.client = AsyncAnthropic(api_key=api_key)

    def _build_messages(self, messages: list[dict]) -> list[dict]:
        result = []
        for msg in messages:
            if msg["role"] == "system":
                continue
            result.append(msg)
        return result

    def _get_system(self, messages: list[dict]) -> Optional[str]:
        system_parts = []
        if self.system_prompt:
            system_parts.append(self.system_prompt)
        for msg in messages:
            if msg["role"] == "system":
                system_parts.append(msg["content"])
        return "\n\n".join(system_parts) if system_parts else None

    async def chat(
        self,
        messages: list[dict],
        tools: Optional[list[dict]] = None,
    ) -> MessageResponse:
        system = self._get_system(messages)
        chat_messages = self._build_messages(messages)
        formatted_tools = tools if self.tools_enabled else None

        kwargs = {
            "model": self.model_name,
            "messages": chat_messages,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
        }
        if system:
            kwargs["system"] = system
        if formatted_tools:
            kwargs["tools"] = formatted_tools

        try:
            response = await self.client.messages.create(**kwargs)

            content_blocks = []
            tool_calls_data = None
            for block in response.content:
                if block.type == "text":
                    content_blocks.append(block.text)
                elif block.type == "tool_use":
                    if tool_calls_data is None:
                        tool_calls_data = []
                    tool_calls_data.append({
                        "id": block.id,
                        "type": "tool_use",
                        "name": block.name,
                        "input": block.input,
                    })

            return MessageResponse(
                id=f"msg-{datetime.now(timezone.utc).timestamp()}",
                session_id="",
                role="assistant",
                content="".join(content_blocks),
                tool_calls=tool_calls_data,
                tokens_used=response.usage.input_tokens + response.usage.output_tokens if response.usage else None,
                created_at=datetime.now(timezone.utc),
            )
        except Exception as e:
            return MessageResponse(
                id=f"msg-err-{datetime.now(timezone.utc).timestamp()}",
                session_id="",
                role="assistant",
                content=f"Error: {str(e)}",
                created_at=datetime.now(timezone.utc),
            )

    async def chat_stream(
        self,
        messages: list[dict],
        tools: Optional[list[dict]] = None,
    ) -> AsyncIterator[str]:
        system = self._get_system(messages)
        chat_messages = self._build_messages(messages)
        formatted_tools = tools if self.tools_enabled else None

        kwargs = {
            "model": self.model_name,
            "messages": chat_messages,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "stream": True,
        }
        if system:
            kwargs["system"] = system
        if formatted_tools:
            kwargs["tools"] = formatted_tools

        try:
            async with self.client.messages.stream(**kwargs) as stream:
                async for text in stream.text_stream:
                    yield text
        except Exception as e:
            yield f"Error: {str(e)}"

    async def analyze(
        self,
        prompt: str,
        context: Optional[dict] = None,
    ) -> str:
        messages = [{"role": "user", "content": prompt}]
        system = None
        if context:
            system = f"Context information:\n{context}"
        if self.system_prompt:
            system = f"{self.system_prompt}\n\n{system}" if system else self.system_prompt

        kwargs = {
            "model": self.model_name,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "messages": messages,
        }
        if system:
            kwargs["system"] = system

        try:
            response = await self.client.messages.create(**kwargs)
            return "".join(
                block.text for block in response.content if block.type == "text"
            )
        except Exception as e:
            return f"Error: {str(e)}"

    def get_model_config(self) -> dict:
        return {
            "provider": "anthropic",
            "model": self.model_name,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
        }
