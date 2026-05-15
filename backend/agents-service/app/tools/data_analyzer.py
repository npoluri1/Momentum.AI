import csv
import json
import io
from typing import Any, Optional
from app.tools.base_tool import BaseTool


class DataAnalyzerTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="data_analyzer",
            description="Analyze structured data from CSV or JSON. Can summarize, filter, sort, group, and compute basic statistics.",
        )

    async def execute(
        self,
        data: str,
        operation: str = "summarize",
        data_format: str = "auto",
        filters: Optional[list[dict]] = None,
        group_by: Optional[str] = None,
        **kwargs,
    ) -> dict[str, Any]:
        records = self._parse_data(data, data_format)
        if isinstance(records, dict) and "error" in records:
            return records

        if operation == "summarize":
            return self._summarize(records)
        elif operation == "filter":
            return self._filter(records, filters or [])
        elif operation == "statistics":
            return self._statistics(records)
        elif operation == "head":
            n = kwargs.get("n", 10)
            return {"data": records[:n], "total": len(records), "displayed": n}
        else:
            return {"error": f"Unknown operation: {operation}"}

    def _parse_data(self, data: str, data_format: str) -> Any:
        if data_format == "json" or (data_format == "auto" and data.strip().startswith("[")):
            try:
                return json.loads(data)
            except json.JSONDecodeError as e:
                return {"error": f"Invalid JSON: {str(e)}"}
        elif data_format == "csv" or data_format == "auto":
            try:
                reader = csv.DictReader(io.StringIO(data))
                return list(reader)
            except Exception as e:
                return {"error": f"Invalid CSV: {str(e)}"}
        return {"error": "Unable to detect data format"}

    def _summarize(self, records: list) -> dict[str, Any]:
        if not records:
            return {"records": 0, "fields": [], "summary": "No records found"}
        if isinstance(records, dict):
            return {"error": "Expected a list of records"}
        fields = list(records[0].keys()) if records else []
        return {
            "records": len(records),
            "fields": fields,
            "field_count": len(fields),
            "sample": records[:3],
        }

    def _filter(self, records: list, filters: list[dict]) -> dict[str, Any]:
        filtered = []
        for record in records:
            match = True
            for f in filters:
                field = f.get("field")
                operator = f.get("operator", "eq")
                value = f.get("value")
                record_value = record.get(field)
                if operator == "eq" and record_value != value:
                    match = False
                elif operator == "neq" and record_value == value:
                    match = False
                elif operator == "contains" and value not in str(record_value):
                    match = False
                elif operator == "gt":
                    try:
                        if float(record_value) <= float(value):
                            match = False
                    except (ValueError, TypeError):
                        match = False
                elif operator == "lt":
                    try:
                        if float(record_value) >= float(value):
                            match = False
                    except (ValueError, TypeError):
                        match = False
            if match:
                filtered.append(record)
        return {
            "data": filtered,
            "total": len(records),
            "filtered_count": len(filtered),
        }

    def _statistics(self, records: list) -> dict[str, Any]:
        if not records:
            return {"error": "No data for statistics"}
        numeric_fields = {}
        for record in records:
            for key, val in record.items():
                try:
                    v = float(val)
                    if key not in numeric_fields:
                        numeric_fields[key] = []
                    numeric_fields[key].append(v)
                except (ValueError, TypeError):
                    pass
        stats = {}
        for field, values in numeric_fields.items():
            if values:
                stats[field] = {
                    "min": min(values),
                    "max": max(values),
                    "avg": sum(values) / len(values),
                    "count": len(values),
                }
        return {
            "statistics": stats,
            "total_records": len(records),
        }

    def to_openai_format(self) -> dict:
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": {
                    "type": "object",
                    "properties": {
                        "data": {"type": "string", "description": "Raw data as string (CSV or JSON)"},
                        "operation": {
                            "type": "string",
                            "enum": ["summarize", "filter", "statistics", "head"],
                            "description": "Operation to perform",
                        },
                        "data_format": {
                            "type": "string",
                            "enum": ["auto", "csv", "json"],
                            "description": "Format of the input data",
                        },
                    },
                    "required": ["data"],
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
                    "data": {"type": "string", "description": "Raw data as string (CSV or JSON)"},
                    "operation": {
                        "type": "string",
                        "enum": ["summarize", "filter", "statistics", "head"],
                        "description": "Operation to perform",
                    },
                    "data_format": {
                        "type": "string",
                        "enum": ["auto", "csv", "json"],
                        "description": "Format of the input data",
                    },
                },
                "required": ["data"],
            },
        }

    def to_gemini_format(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "parameters": {
                "type": "object",
                "properties": {
                    "data": {"type": "string", "description": "Raw data as string (CSV or JSON)"},
                    "operation": {
                        "type": "string",
                        "enum": ["summarize", "filter", "statistics", "head"],
                    },
                    "data_format": {"type": "string", "enum": ["auto", "csv", "json"]},
                },
                "required": ["data"],
            },
        }
