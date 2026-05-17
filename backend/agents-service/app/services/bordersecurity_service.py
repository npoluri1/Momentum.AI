from pydantic import BaseModel
class BorderSecurityModel(BaseModel):
    id: str
    status: str
class BorderSecurityService:
    def get_status(self, id: str) -> BorderSecurityModel:
        return BorderSecurityModel(id=id, status='Active')
    def execute_action(self, id: str):
        return {'status': 'success', 'msg': 'Action executed'}
