from pydantic import BaseModel

class PipelineStatusModel(BaseModel):
    pipeline_id: str
    pressure: float
    flow_rate: float
    leak_probability: float # 0.0 to 1.0
    is_operational: bool

class PetroleumService:
    def get_pipeline_status(self, pipeline_id: str) -> PipelineStatusModel:
        # Simulate pipeline sensor data
        return PipelineStatusModel(
            pipeline_id=pipeline_id,
            pressure=1200.5,
            flow_rate=500.2,
            leak_probability=0.02,
            is_operational=True
        )

    def emergency_shutoff(self, pipeline_id: str):
        # Trigger autonomous shutoff protocol
        return {"status": "success", "message": f"Emergency shutoff engaged for pipeline {pipeline_id}."}
