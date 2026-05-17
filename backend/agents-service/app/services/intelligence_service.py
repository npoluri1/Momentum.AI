from pydantic import BaseModel
from typing import List

class IntelligenceAssessmentModel(BaseModel):
    threat_level: str # 'Low', 'Medium', 'High', 'Critical'
    primary_domain: str # e.g., 'Geopolitical', 'Cyber'
    confidence_score: float # 0.0 to 1.0
    recommended_action: str

class IntelligenceService:
    def get_strategic_assessment(self, sector: str) -> IntelligenceAssessmentModel:
        # Simulate fusion of intelligence streams
        return IntelligenceAssessmentModel(
            threat_level="Medium",
            primary_domain="Geopolitical",
            confidence_score=0.82,
            recommended_action="Increase monitoring posture."
        )

    def trigger_briefing(self, threat_level: str):
        # Trigger autonomous Command briefing protocol
        return {"status": "success", "message": f"Emergency National Security briefing initiated for {threat_level} threat."}
