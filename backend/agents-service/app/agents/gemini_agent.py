from typing import Optional, AsyncIterator
import google.generativeai as genai
from app.agents.base_agent import BaseAgent
from app.config import settings
from app.schemas import MessageResponse
from datetime import datetime, timezone


class GeminiAgent(BaseAgent):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        api_key = kwargs.get("api_key") or settings.gemini_api_key
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(
            model_name=self.model_name,
            system_instruction=self.system_prompt,
            generation_config={
                "temperature": self.temperature,
                "max_output_tokens": self.max_tokens,
            },
        )

    def _build_contents(self, messages: list[dict]) -> list[dict]:
        contents = []
        for msg in messages:
            if msg["role"] == "system":
                continue
            role = "model" if msg["role"] == "assistant" else "user"
            contents.append({"role": role, "parts": [msg["content"]]})
        return contents

    async def chat(
        self,
        messages: list[dict],
        tools: Optional[list[dict]] = None,
    ) -> MessageResponse:
        contents = self._build_contents(messages)
        formatted_tools = self._build_tools(tools) if self.tools_enabled and tools else None

        try:
            if formatted_tools:
                config = {"tools": formatted_tools}
                response = await self.model.generate_content_async(
                    contents=contents,
                    generation_config={"temperature": self.temperature, "max_output_tokens": self.max_tokens},
                    tools=formatted_tools,
                )
            else:
                response = await self.model.generate_content_async(
                    contents=contents,
                    generation_config={"temperature": self.temperature, "max_output_tokens": self.max_tokens},
                )

            return MessageResponse(
                id=f"msg-{datetime.now(timezone.utc).timestamp()}",
                session_id="",
                role="assistant",
                content=response.text if hasattr(response, "text") else "",
                tokens_used=(
                    response.usage_metadata.prompt_token_count + response.usage_metadata.candidates_token_count
                    if hasattr(response, "usage_metadata") and response.usage_metadata
                    else None
                ),
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

    def _build_tools(self, tools: list[dict]) -> list[dict]:
        function_declarations = []
        for tool in tools:
            if "function" in tool:
                func = tool["function"]
                function_declarations.append({
                    "name": func["name"],
                    "description": func.get("description", ""),
                    "parameters": func.get("parameters", {}),
                })
            else:
                function_declarations.append({
                    "name": tool["name"],
                    "description": tool.get("description", ""),
                    "parameters": tool.get("input_schema", tool.get("parameters", {})),
                })
        return [{"function_declarations": function_declarations}]

    async def chat_stream(
        self,
        messages: list[dict],
        tools: Optional[list[dict]] = None,
    ) -> AsyncIterator[str]:
        contents = self._build_contents(messages)
        try:
            response = await self.model.generate_content_async(
                contents=contents,
                generation_config={"temperature": self.temperature, "max_output_tokens": self.max_tokens},
                stream=True,
            )
            async for chunk in response:
                if hasattr(chunk, "text") and chunk.text:
                    yield chunk.text
        except Exception as e:
            yield f"Error: {str(e)}"

    async def analyze(
        self,
        prompt: str,
        context: Optional[dict] = None,
    ) -> str:
        full_prompt = prompt
        if context:
            full_prompt = f"Context:\n{context}\n\nTask:\n{prompt}"
        try:
            response = await self.model.generate_content_async(full_prompt)
            return response.text if hasattr(response, "text") else ""
        except Exception as e:
            return f"Error: {str(e)}"

    def get_model_config(self) -> dict:
        return {
            "provider": "gemini",
            "model": self.model_name,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
        }
