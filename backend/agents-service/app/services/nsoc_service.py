from pydantic import BaseModel
from typing import List, Dict

class NationalSecurityStatus(BaseModel):
    national_risk_level: str # 'Green', 'Yellow', 'Orange', 'Red'
    active_verticals: List[str]
    systemic_threats: List[str]
    readiness_index: float # 0.0 to 1.0

class NSOCService:
    def get_national_status(self) -> NationalSecurityStatus:
        # Simulate aggregation of all industrial verticals
        return NationalSecurityStatus(
            national_risk_level="Green",
            active_verticals=["Energy", "Defense", "Infrastructure", "Finance", "Healthcare"],
            systemic_threats=["None detected"],
            readiness_index=0.92
        )

    def trigger_national_emergency(self, reason: str):
        # Trigger highest level multi-agency emergency protocol
        return {"status": "success", "message": f"National Emergency Protocol: {reason} activated. All systems alerted."}
