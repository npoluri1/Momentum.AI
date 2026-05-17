from pydantic import BaseModel

class ForestMetricsModel(BaseModel):
    region_id: str
    humidity: float # percentage
    wildfire_risk: float # 0.0 to 1.0
    biodiversity_index: float # 0.0 to 1.0
    is_protected_zone: bool

class ForestryService:
    def get_forest_status(self, region_id: str) -> ForestMetricsModel:
        # Simulate satellite and forest sensor data
        return ForestMetricsModel(
            region_id=region_id,
            humidity=22.5,
            wildfire_risk=0.65, # Elevated risk alert
            biodiversity_index=0.88,
            is_protected_zone=True
        )

    def trigger_fire_containment(self, region_id: str):
        # Trigger autonomous containment and suppression
        return {"status": "success", "message": f"Fire containment protocol active for region {region_id}."}
