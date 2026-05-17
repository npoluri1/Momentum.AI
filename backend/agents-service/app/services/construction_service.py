from pydantic import BaseModel

class ConstructionProjectModel(BaseModel):
    project_id: str
    progress_percentage: float
    safety_violations: int
    budget_variance: float # percentage

class ConstructionService:
    def get_project_status(self, project_id: str) -> ConstructionProjectModel:
        # Simulate site sensor and scheduling data
        return ConstructionProjectModel(
            project_id=project_id,
            progress_percentage=45.2,
            safety_violations=0,
            budget_variance=2.5
        )

    def adjust_scheduling(self, project_id: str, priority_task: str):
        # Trigger autonomous project rescheduling
        return {"status": "success", "message": f"Project {project_id} schedule updated for {priority_task}."}
