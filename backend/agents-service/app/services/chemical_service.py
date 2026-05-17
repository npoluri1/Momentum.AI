from pydantic import BaseModel

class ChemicalProcessModel(BaseModel):
    reactor_id: str
    temperature: float
    pressure: float
    emission_level: float # in ppm
    is_safe: bool

class ChemicalService:
    def get_process_status(self, reactor_id: str) -> ChemicalProcessModel:
        # Simulate chemical manufacturing data
        return ChemicalProcessModel(
            reactor_id=reactor_id,
            temperature=250.5,
            pressure=15.2,
            emission_level=12.0, # ppm
            is_safe=True
        )

    def adjust_reaction_parameters(self, reactor_id: str, temp_offset: float):
        # Trigger autonomous process adjustment
        return {"status": "success", "message": f"Reaction parameters adjusted for {reactor_id} to optimize efficiency."}
