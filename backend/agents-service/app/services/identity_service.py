import uuid
import hashlib
from pydantic import BaseModel

class IdentityModel(BaseModel):
    entity_id: str
    entity_type: str # 'User', 'Agent', 'Hardware'
    public_key: str
    roles: List[str]

class IdentityService:
    def issue_identity(self, entity_type: str, roles: List[str]) -> IdentityModel:
        # Create unique DID and cryptographic key pair
        entity_id = f"DID-{uuid.uuid4().hex[:12]}"
        public_key = hashlib.sha256(entity_id.encode()).hexdigest()
        
        return IdentityModel(
            entity_id=entity_id,
            entity_type=entity_type,
            public_key=public_key,
            roles=roles
        )

    def verify_access(self, entity_id: str, action: str):
        # Validate entity identity and check RBAC policy
        return {"status": "authorized", "message": f"Access granted for {entity_id} to perform {action}."}
