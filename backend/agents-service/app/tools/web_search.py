from typing import Any, Optional
import aiohttp
from app.tools.base_tool import BaseTool


class WebSearchTool(BaseTool):
    def __init__(self, search_url: str = "https://api.duckduckgo.com"):
        super().__init__(
            name="web_search",
            description="Search the web for current information. Returns relevant snippets and URLs.",
        )
        self.search_url = search_url

    async def execute(self, query: str, max_results: int = 5, **kwargs) -> list[dict[str, Any]]:
        params = {
            "q": query,
            "format": "json",
            "max_results": max_results,
        }
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(
                    "https://api.duckduckgo.com/",
                    params={"q": query, "format": "json", "no_html": "1"},
                    timeout=aiohttp.ClientTimeout(total=10),
                ) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        results = []
                        for topic in data.get("RelatedTopics", []):
                            if "FirstURL" in topic:
                                results.append({
                                    "title": topic.get("Text", "").split(" - ")[0],
                                    "url": topic.get("FirstURL", ""),
                                    "snippet": topic.get("Text", ""),
                                })
                        return results[:max_results]
                    return [{"error": f"Search failed with status {resp.status}"}]
            except Exception as e:
                return [{"error": f"Search error: {str(e)}"}]

    def to_openai_format(self) -> dict:
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "The search query string",
                        },
                        "max_results": {
                            "type": "integer",
                            "description": "Maximum number of results to return",
                            "default": 5,
                        },
                    },
                    "required": ["query"],
                },
            },
        }

    def to_anthropic_format(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query string",
                    },
                    "max_results": {
                        "type": "integer",
                        "description": "Maximum number of results to return",
                        "default": 5,
                    },
                },
                "required": ["query"],
            },
        }

    def to_gemini_format(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query string",
                    },
                    "max_results": {
                        "type": "integer",
                        "description": "Maximum number of results to return",
                    },
                },
                "required": ["query"],
            },
        }
