from typing import Optional
from app.tools.base_tool import BaseTool
from app.tools.web_search import WebSearchTool
from app.tools.web_fetch import WebFetchTool
from app.tools.code_executor import CodeExecutorTool
from app.tools.data_analyzer import DataAnalyzerTool
from app.tools.design_3d import Design3DTool


class ToolRegistry:
    _tools: dict[str, BaseTool] = {}

    @classmethod
    def register_defaults(cls):
        cls.register(WebSearchTool())
        cls.register(WebFetchTool())
        cls.register(CodeExecutorTool())
        cls.register(DataAnalyzerTool())
        cls.register(Design3DTool())

    @classmethod
    def register(cls, tool: BaseTool):
        cls._tools[tool.name] = tool

    @classmethod
    def get(cls, name: str) -> Optional[BaseTool]:
        return cls._tools.get(name)

    @classmethod
    def get_enabled(cls, names: list[str]) -> list[BaseTool]:
        return [cls._tools[n] for n in names if n in cls._tools]

    @classmethod
    def get_all(cls) -> dict[str, BaseTool]:
        return dict(cls._tools)

    @classmethod
    def to_openai_tools(cls, names: list[str]) -> list[dict]:
        return [tool.to_openai_format() for name, tool in cls._tools.items() if name in names]

    @classmethod
    def to_anthropic_tools(cls, names: list[str]) -> list[dict]:
        return [tool.to_anthropic_format() for name, tool in cls._tools.items() if name in names]

    @classmethod
    def to_gemini_tools(cls, names: list[str]) -> list[dict]:
        return [tool.to_gemini_format() for name, tool in cls._tools.items() if name in names]


ToolRegistry.register_defaults()
