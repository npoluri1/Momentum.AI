from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.orchestrator import PromptOrchestrator
from app.services.risk_engine import RiskEngine

router = APIRouter(prefix="/api/gio", tags=["GIO"])
orchestrator = PromptOrchestrator()
risk_engine = RiskEngine()

class AnalysisRequest(BaseModel):
    query: str
    levels: list[str] = ["level1_root_brain", "level2_industry_discovery"]

@router.post("/analyze")
async def analyze(request: AnalysisRequest):
    try:
        system_context = orchestrator.assemble_context(request.levels)
        return {
            "status": "success",
            "context_used": request.levels,
            "response": f"GIO analysis for: {request.query} initiated using {request.levels} levels."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/simulate")
async def simulate():
    """Trigger the systemic risk simulator."""
    return risk_engine.check_systemic_risk()
