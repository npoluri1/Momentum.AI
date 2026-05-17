import pytest
from app.tools.tool_registry import ToolRegistry
from app.tools.base_tool import BaseTool


def test_tool_registry_register_and_get():
    registry = ToolRegistry()
    tools = registry.get_all_tools()
    assert len(tools) > 0


def test_tool_registry_has_expected_tools():
    registry = ToolRegistry()
    tool_names = [t.name for t in registry.get_all_tools()]
    assert "web_search" in tool_names
    assert "web_fetch" in tool_names
    assert "data_analyzer" in tool_names or "code_executor" in tool_names
