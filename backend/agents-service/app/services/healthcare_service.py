from pydantic import BaseModel
from typing import List

class HospitalCapacityModel(BaseModel):
    hospital_id: str
    bed_occupancy: float # percentage
    ventilator_availability: int
    outbreak_risk: float # 0.0 to 1.0

class HealthcareService:
    def get_hospital_capacity(self, hospital_id: str) -> HospitalCapacityModel:
        # Simulate healthcare facility data
        return HospitalCapacityModel(
            hospital_id=hospital_id,
            bed_occupancy=78.5,
            ventilator_availability=12,
            outbreak_risk=0.15
        )

    def trigger_surge_protocol(self, hospital_id: str):
        # Trigger surge capacity and patient diversion
        return {"status": "success", "message": f"Surge protocol initiated for hospital {hospital_id}."}
