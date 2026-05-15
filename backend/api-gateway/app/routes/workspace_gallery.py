from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone
import uuid

router = APIRouter(prefix="/api/v1/gallery", tags=["workspace-gallery"])


class WorkspaceAppResponse(BaseModel):
    id: str
    team: str
    name: str
    description: str
    screenshotUrl: str
    projects: int
    agents: int
    flows: int
    category: str
    cloneCount: int
    isCloned: bool
    createdAt: str


class CloneRequest(BaseModel):
    workspaceId: str


class CloneResponse(BaseModel):
    success: bool
    workspaceId: str
    message: str


GALLERY_WORKSPACES = [
    {
        "id": "dry36084slddvvrh",
        "team": "SALES@taskade",
        "name": "Pipeline that scores every lead",
        "description": "AI-powered sales pipeline with lead scoring, deal tracking, and automated follow-ups.",
        "screenshotUrl": "https://www.taskade.com/share/apps/dry36084slddvvrh/screenshot.png",
        "projects": 4, "agents": 2, "flows": 3,
        "category": "sales", "cloneCount": 1247,
    },
    {
        "id": "nsrm12wns3e1cgni",
        "team": "SALES@taskade",
        "name": "Neon CRM with deal tracking",
        "description": "Modern CRM with visual pipeline, contact management, and deal tracking.",
        "screenshotUrl": "https://www.taskade.com/share/apps/nsrm12wns3e1cgni/screenshot.png",
        "projects": 2, "agents": 1, "flows": 2,
        "category": "sales", "cloneCount": 892,
    },
    {
        "id": "aauj1flqzp21lhxn",
        "team": "RESEARCH@taskade",
        "name": "AI insight matrix, live drill-down",
        "description": "Research workspace with AI-powered insight matrix and interactive drill-down analytics.",
        "screenshotUrl": "https://www.taskade.com/share/apps/aauj1flqzp21lhxn/screenshot.png",
        "projects": 16, "agents": 10, "flows": 7,
        "category": "research", "cloneCount": 2156,
    },
    {
        "id": "4ejkdd6ecdhujryh",
        "team": "RESEARCH@taskade",
        "name": "Eligibility analytics dashboard",
        "description": "Analytics dashboard for eligibility tracking and reporting.",
        "screenshotUrl": "https://www.taskade.com/share/apps/4ejkdd6ecdhujryh/screenshot.png",
        "projects": 3, "agents": 1, "flows": 1,
        "category": "research", "cloneCount": 456,
    },
    {
        "id": "tmnju1vsp3ggajo7",
        "team": "OPS@taskade",
        "name": "Finance tracker, profit at a glance",
        "description": "Real-time finance tracking with profit monitoring and expense management.",
        "screenshotUrl": "https://www.taskade.com/share/apps/tmnju1vsp3ggajo7/screenshot.png",
        "projects": 3, "agents": 1, "flows": 2,
        "category": "operations", "cloneCount": 678,
    },
    {
        "id": "v71ywf2zs5bu9a5m",
        "team": "OPS@taskade",
        "name": "Invoice generator that auto-sends",
        "description": "Automated invoice generation and delivery system with template management.",
        "screenshotUrl": "https://www.taskade.com/share/apps/v71ywf2zs5bu9a5m/screenshot.png",
        "projects": 3, "agents": 1, "flows": 4,
        "category": "operations", "cloneCount": 1543,
    },
    {
        "id": "564685gvoq7j7oua",
        "team": "SUPPORT@taskade",
        "name": "Customer health with churn risk",
        "description": "Customer health scoring and churn risk prediction with automated interventions.",
        "screenshotUrl": "https://www.taskade.com/share/apps/564685gvoq7j7oua/screenshot.png",
        "projects": 4, "agents": 1, "flows": 2,
        "category": "support", "cloneCount": 891,
    },
    {
        "id": "s4pf46i9wi60h0rv",
        "team": "SUPPORT@taskade",
        "name": "SLA workflow with escalations",
        "description": "SLA management with automated escalations and response time tracking.",
        "screenshotUrl": "https://www.taskade.com/share/apps/s4pf46i9wi60h0rv/screenshot.png",
        "projects": 3, "agents": 1, "flows": 1,
        "category": "support", "cloneCount": 567,
    },
    {
        "id": "j1n0746e1z0olf6r",
        "team": "SALES@taskade",
        "name": "Sales Pipeline Dashboard",
        "description": "Comprehensive sales pipeline visualization with stage tracking.",
        "screenshotUrl": "https://www.taskade.com/share/apps/j1n0746e1z0olf6r/screenshot.png",
        "projects": 3, "agents": 1, "flows": 0,
        "category": "sales", "cloneCount": 2345,
    },
    {
        "id": "ncmibyh4dgh6q0py",
        "team": "SALES@taskade",
        "name": "Broker Calendar",
        "description": "Calendar management for brokers with appointment scheduling.",
        "screenshotUrl": "https://www.taskade.com/share/apps/ncmibyh4dgh6q0py/screenshot.png",
        "projects": 2, "agents": 1, "flows": 3,
        "category": "sales", "cloneCount": 345,
    },
    {
        "id": "sqe69c1zmfbkrexu",
        "team": "SALES@taskade",
        "name": "Shopify-Style Storefront",
        "description": "Full e-commerce storefront with product management and checkout.",
        "screenshotUrl": "https://www.taskade.com/share/apps/sqe69c1zmfbkrexu/screenshot.png",
        "projects": 4, "agents": 1, "flows": 4,
        "category": "sales", "cloneCount": 1234,
    },
    {
        "id": "avl35iqxc8t7wk3e",
        "team": "SALES@taskade",
        "name": "Client Connect Dashboard",
        "description": "Client portal with project tracking, communication, and file sharing.",
        "screenshotUrl": "https://www.taskade.com/share/apps/avl35iqxc8t7wk3e/screenshot.png",
        "projects": 3, "agents": 1, "flows": 4,
        "category": "sales", "cloneCount": 789,
    },
]


@router.get("/workspaces", response_model=List[WorkspaceAppResponse])
async def list_workspaces(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search by name"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    results = GALLERY_WORKSPACES
    if category:
        results = [w for w in results if w["category"] == category.lower()]
    if search:
        results = [w for w in results if search.lower() in w["name"].lower()]
    start = (page - 1) * limit
    return [
        WorkspaceAppResponse(**w, isCloned=False)
        for w in results[start : start + limit]
    ]


@router.get("/workspaces/{workspace_id}", response_model=WorkspaceAppResponse)
async def get_workspace(workspace_id: str):
    for w in GALLERY_WORKSPACES:
        if w["id"] == workspace_id:
            return WorkspaceAppResponse(**w, isCloned=False)
    raise HTTPException(status_code=404, detail="Workspace not found")


@router.post("/clone", response_model=CloneResponse)
async def clone_workspace(req: CloneRequest):
    workspace = None
    for w in GALLERY_WORKSPACES:
        if w["id"] == req.workspaceId:
            workspace = w
            break
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    new_id = str(uuid.uuid4())[:15]
    return CloneResponse(
        success=True,
        workspaceId=new_id,
        message=f"Cloned workspace '{workspace['name']}' successfully",
    )


@router.get("/categories")
async def list_categories():
    return {
        "categories": [
            {"id": "sales", "name": "Sales", "count": 6},
            {"id": "operations", "name": "Operations", "count": 2},
            {"id": "marketing", "name": "Marketing", "count": 0},
            {"id": "ai-tools", "name": "AI Tools", "count": 0},
            {"id": "productivity", "name": "Productivity", "count": 0},
            {"id": "support", "name": "Support", "count": 2},
            {"id": "research", "name": "Research", "count": 2},
        ]
    }
