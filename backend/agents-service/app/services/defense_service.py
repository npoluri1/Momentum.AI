from pydantic import BaseModel
from typing import List

class ThreatAlertModel(BaseModel):
    threat_id: str
    domain: str # Land, Air, Sea, Cyber, Space
    severity: int # 1-10
    location: str
    is_active: bool

class DefenseService:
    def get_threat_status(self, domain: str) -> List[ThreatAlertModel]:
        # Simulate defense intelligence data
        return [
            ThreatAlertModel(
                threat_id="TR-001",
                domain=domain,
                severity=7,
                location="Sector North-Alpha",
                is_active=True
            )
        ]

    def execute_mission_plan(self, threat_id: str):
        # Trigger tactical defense protocol
        return {"status": "success", "message": f"Tactical response engaged for threat {threat_id}."}
