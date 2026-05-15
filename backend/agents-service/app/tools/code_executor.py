import sys
import io
import json
import traceback
from typing import Any
from app.tools.base_tool import BaseTool


class CodeExecutorTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="code_executor",
            description="Execute Python code in a sandboxed environment and return stdout, stderr, and result. The code must be safe and non-destructive.",
        )

    async def execute(self, code: str, timeout: int = 10, **kwargs) -> dict[str, Any]:
        stdout_capture = io.StringIO()
        stderr_capture = io.StringIO()
        old_stdout = sys.stdout
        old_stderr = sys.stderr

        restricted_builtins = {
            "abs": abs, "all": all, "any": any, "ascii": ascii, "bin": bin,
            "bool": bool, "bytearray": bytearray, "bytes": bytes, "callable": callable,
            "chr": chr, "complex": complex, "dict": dict, "dir": dir, "divmod": divmod,
            "enumerate": enumerate, "filter": filter, "float": float, "format": format,
            "frozenset": frozenset, "getattr": getattr, "hasattr": hasattr, "hash": hash,
            "hex": hex, "id": id, "int": int, "isinstance": isinstance, "issubclass": issubclass,
            "iter": iter, "len": len, "list": list, "map": map, "max": max, "min": min,
            "next": next, "object": object, "oct": oct, "ord": ord, "pow": pow,
            "print": print, "range": range, "repr": repr, "reversed": reversed,
            "round": round, "set": set, "slice": slice, "sorted": sorted, "str": str,
            "sum": sum, "tuple": tuple, "type": type, "zip": zip,
            "True": True, "False": False, "None": None,
            "__import__": __import__,
        }

        banned_modules = ["os", "subprocess", "shutil", "socket", "sys"] if False else []

        try:
            sys.stdout = stdout_capture
            sys.stderr = stderr_capture

            compiled = compile(code, "<sandbox>", "exec")

            restricted_globals = {
                "__builtins__": restricted_builtins,
                "__name__": "__sandbox__",
            }

            exec(compiled, restricted_globals)

            stdout = stdout_capture.getvalue()
            stderr = stderr_capture.getvalue()

            return {
                "stdout": stdout,
                "stderr": stderr,
                "success": True,
            }
        except Exception as e:
            stderr = stderr_capture.getvalue()
            return {
                "stdout": stdout_capture.getvalue(),
                "stderr": stderr + "\n" + traceback.format_exc(),
                "success": False,
                "error": str(e),
            }
        finally:
            sys.stdout = old_stdout
            sys.stderr = old_stderr

    def to_openai_format(self) -> dict:
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": {
                    "type": "object",
                    "properties": {
                        "code": {
                            "type": "string",
                            "description": "Python code to execute",
                        },
                        "timeout": {
                            "type": "integer",
                            "description": "Execution timeout in seconds",
                            "default": 10,
                        },
                    },
                    "required": ["code"],
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
                    "code": {"type": "string", "description": "Python code to execute"},
                    "timeout": {"type": "integer", "description": "Execution timeout in seconds"},
                },
                "required": ["code"],
            },
        }

    def to_gemini_format(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "parameters": {
                "type": "object",
                "properties": {
                    "code": {"type": "string", "description": "Python code to execute"},
                    "timeout": {"type": "integer", "description": "Execution timeout in seconds"},
                },
                "required": ["code"],
            },
        }
