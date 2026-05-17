from pydantic import BaseModel
from typing import List

class EnergyGridModel(BaseModel):
    station_id: str
    current_load: float
    capacity: float
    predicted_load: float
    is_at_risk: bool

class EnergyService:
    def get_station_data(self, station_id: str) -> EnergyGridModel:
        # Simulate grid data
        return EnergyGridModel(
            station_id=station_id,
            current_load=85.5,
            capacity=1000.0,
            predicted_load=92.0,
            is_at_risk=False
        )

    def optimize_load(self, station_id: str):
        # Trigger load re-balancing orchestration
        return {"status": "success", "message": "Load re-balanced across grid sectors."}
