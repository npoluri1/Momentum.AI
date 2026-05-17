from pydantic import BaseModel

class EmergencyIncidentModel(BaseModel):
    incident_id: str
    incident_type: str # Medical, Fire, Crime
    location: str
    response_time_estimate: float # minutes
    is_critical: bool

class SafetyService:
    def get_incident_status(self, incident_id: str) -> EmergencyIncidentModel:
        # Simulate incident dispatch data
        return EmergencyIncidentModel(
            incident_id=incident_id,
            incident_type="Medical",
            location="Sector South-Beta",
            response_time_estimate=4.5,
            is_critical=True
        )

    def dispatch_emergency_resource(self, resource_type: str, location: str):
        # Trigger autonomous dispatching protocol
        return {"status": "success", "message": f"Autonomous dispatch of {resource_type} to {location} initiated."}
