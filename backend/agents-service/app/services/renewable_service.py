from pydantic import BaseModel
from typing import List

class RenewableGenerationModel(BaseModel):
    source_type: str # 'Solar', 'Wind'
    expected_output: float # MW
    actual_output: float # MW
    weather_confidence: float # 0.0 to 1.0

class RenewableService:
    def get_forecast(self, sector_id: str) -> List[RenewableGenerationModel]:
        # Simulate renewable weather-dependent forecast data
        return [
            RenewableGenerationModel(
                source_type="Solar",
                expected_output=500.0,
                actual_output=480.0,
                weather_confidence=0.92
            ),
            RenewableGenerationModel(
                source_type="Wind",
                expected_output=300.0,
                actual_output=250.0,
                weather_confidence=0.75
            )
        ]

    def adjust_storage_dispatch(self, output_delta: float):
        # Trigger autonomous battery discharge/charge protocol
        return {"status": "success", "message": f"Battery storage adjusted by {output_delta} MW to compensate for generation delta."}
