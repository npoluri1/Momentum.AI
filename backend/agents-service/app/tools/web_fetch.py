from typing import Any, Optional
import aiohttp
from app.tools.base_tool import BaseTool
from html.parser import HTMLParser


class _TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self._text = []
        self._skip = False

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self._skip = True

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self._skip = False

    def handle_data(self, data):
        if not self._skip:
            stripped = data.strip()
            if stripped:
                self._text.append(stripped)

    def get_text(self) -> str:
        return " ".join(self._text)


class WebFetchTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="web_fetch",
            description="Fetch and extract readable text content from a web page URL.",
        )

    async def execute(self, url: str, max_length: int = 10000, **kwargs) -> dict[str, Any]:
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(
                    url,
                    headers={"User-Agent": "AI-Agent-Service/1.0"},
                    timeout=aiohttp.ClientTimeout(total=15),
                ) as resp:
                    if resp.status != 200:
                        return {"error": f"HTTP {resp.status}", "url": url}
                    html = await resp.text()
                    extractor = _TextExtractor()
                    extractor.feed(html)
                    text = extractor.get_text()[:max_length]
                    return {
                        "url": url,
                        "content": text,
                        "content_length": len(text),
                        "status": resp.status,
                    }
            except Exception as e:
                return {"error": str(e), "url": url}

    def to_openai_format(self) -> dict:
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": {
                    "type": "object",
                    "properties": {
                        "url": {"type": "string", "description": "The URL to fetch"},
                        "max_length": {
                            "type": "integer",
                            "description": "Maximum characters to return",
                            "default": 10000,
                        },
                    },
                    "required": ["url"],
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
                    "url": {"type": "string", "description": "The URL to fetch"},
                    "max_length": {
                        "type": "integer",
                        "description": "Maximum characters to return",
                        "default": 10000,
                    },
                },
                "required": ["url"],
            },
        }

    def to_gemini_format(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "parameters": {
                "type": "object",
                "properties": {
                    "url": {"type": "string", "description": "The URL to fetch"},
                    "max_length": {"type": "integer", "description": "Maximum characters to return"},
                },
                "required": ["url"],
            },
        }
