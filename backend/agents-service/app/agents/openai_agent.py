from typing import Optional, AsyncIterator
from openai import AsyncOpenAI
from app.agents.base_agent import BaseAgent
from app.config import settings
from app.schemas import MessageResponse
from datetime import datetime, timezone


class OpenAIAgent(BaseAgent):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        api_key = kwargs.get("api_key") or settings.openai_api_key
        self.client = AsyncOpenAI(api_key=api_key)

    def _build_messages(self, messages: list[dict]) -> list[dict]:
        result = []
        if self.system_prompt:
            result.append({"role": "system", "content": self.system_prompt})
        result.extend(messages)
        return result

    def _ensure_tool_format(self, tools: Optional[list[dict]]) -> list[dict]:
        return tools or []

    async def chat(
        self,
        messages: list[dict],
        tools: Optional[list[dict]] = None,
    ) -> MessageResponse:
        formatted_messages = self._build_messages(messages)
        formatted_tools = self._ensure_tool_format(tools) if self.tools_enabled else None

        kwargs = {
            "model": self.model_name,
            "messages": formatted_messages,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
        }
        if formatted_tools:
            kwargs["tools"] = formatted_tools

        try:
            response = await self.client.chat.completions.create(**kwargs)
            choice = response.choices[0]
            msg = choice.message

            tool_calls_data = None
            if msg.tool_calls:
                tool_calls_data = [
                    {
                        "id": tc.id,
                        "type": tc.type,
                        "function": {
                            "name": tc.function.name,
                            "arguments": tc.function.arguments,
                        },
                    }
                    for tc in msg.tool_calls
                ]

            return MessageResponse(
                id=f"msg-{datetime.now(timezone.utc).timestamp()}",
                session_id="",
                role="assistant",
                content=msg.content or "",
                tool_calls=tool_calls_data,
                tokens_used=response.usage.total_tokens if response.usage else None,
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
        formatted_messages = self._build_messages(messages)
        formatted_tools = self._ensure_tool_format(tools) if self.tools_enabled else None

        kwargs = {
            "model": self.model_name,
            "messages": formatted_messages,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
            "stream": True,
        }
        if formatted_tools:
            kwargs["tools"] = formatted_tools

        try:
            stream = await self.client.chat.completions.create(**kwargs)
            async for chunk in stream:
                delta = chunk.choices[0].delta if chunk.choices else None
                if delta and delta.content:
                    yield delta.content
        except Exception as e:
            yield f"Error: {str(e)}"

    async def analyze(
        self,
        prompt: str,
        context: Optional[dict] = None,
    ) -> str:
        messages = [{"role": "user", "content": prompt}]
        if context:
            messages.insert(
                0,
                {
                    "role": "system",
                    "content": f"Context information:\n{context}",
                },
            )
        response = await self.chat(messages)
        return response.content

    def get_model_config(self) -> dict:
        return {
            "provider": "openai",
            "model": self.model_name,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
        }
