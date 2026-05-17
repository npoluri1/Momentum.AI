from pydantic import BaseModel
from typing import List

class MachineHealthModel(BaseModel):
    machine_id: str
    vibration_level: float # mm/s
    temperature: float # Celsius
    failure_probability: float # 0.0 to 1.0
    needs_maintenance: bool

class MaintenanceService:
    def get_machine_health(self, machine_id: str) -> MachineHealthModel:
        # Simulate industrial sensor data (vibration/temp)
        return MachineHealthModel(
            machine_id=machine_id,
            vibration_level=4.2,
            temperature=85.0,
            failure_probability=0.15,
            needs_maintenance=False
        )

    def schedule_maintenance(self, machine_id: str, priority: str):
        # Trigger autonomous scheduling or parts procurement
        return {"status": "success", "message": f"Maintenance scheduled for {machine_id} with priority: {priority}."}
