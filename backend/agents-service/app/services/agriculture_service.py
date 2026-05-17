from pydantic import BaseModel

class FarmMetricsModel(BaseModel):
    farm_id: str
    soil_moisture: float # 0.0 to 1.0
    crop_yield_projection: float # tonnes
    pest_risk_level: float # 0.0 to 1.0
    is_at_risk: bool

class AgricultureService:
    def get_farm_status(self, farm_id: str) -> FarmMetricsModel:
        # Simulate farm sensor and satellite data
        return FarmMetricsModel(
            farm_id=farm_id,
            soil_moisture=0.35, # Low moisture alert
            crop_yield_projection=150.0,
            pest_risk_level=0.10,
            is_at_risk=True # Alert condition
        )

    def activate_irrigation(self, farm_id: str):
        # Trigger autonomous irrigation controller
        return {"status": "success", "message": f"Irrigation system activated for {farm_id}."}
