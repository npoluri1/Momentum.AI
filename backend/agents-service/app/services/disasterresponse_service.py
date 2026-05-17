from pydantic import BaseModel
class DisasterResponseModel(BaseModel):
    id: str
    status: str
class DisasterResponseService:
    def get_status(self, id: str) -> DisasterResponseModel:
        return DisasterResponseModel(id=id, status='Active')
    def execute_action(self, id: str):
        return {'status': 'success', 'msg': 'Action executed'}
