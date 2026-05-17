from pydantic import BaseModel
from typing import List

class WorkforceGapModel(BaseModel):
    sector: str
    required_skills: List[str]
    available_skills: List[str]
    gap_index: float # 0.0 to 1.0

class EducationService:
    def get_workforce_gap(self, sector: str) -> WorkforceGapModel:
        # Simulate workforce data analysis
        return WorkforceGapModel(
            sector=sector,
            required_skills=["AI Integration", "Advanced Manufacturing"],
            available_skills=["Basic Assembly", "Office Suite"],
            gap_index=0.65
        )

    def generate_learning_path(self, skill_gap: float):
        # Trigger adaptive curriculum generation
        return {"status": "success", "message": f"Personalized upskilling pathway generated for gap index {skill_gap}."}
