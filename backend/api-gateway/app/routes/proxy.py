from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from httpx import AsyncClient, HTTPStatusError, RequestError

from app.config import get_settings
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas import APIResponse

settings = get_settings()
router = APIRouter(prefix="/proxy", tags=["Proxy"])

SERVICE_MAP: dict[str, str] = {
    "agents": settings.AGENTS_SERVICE_URL,
    "crm": settings.CRM_SERVICE_URL,
    "workflow": settings.WORKFLOW_ENGINE_URL,
    "realtime": settings.REALTIME_SERVICE_URL,
}


async def _proxy_request(
    service: str,
    path: str,
    request: Request,
    current_user: User,
) -> Response:
    base_url = SERVICE_MAP.get(service)
    if not base_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown service: {service}",
        )

    target_url = f"{base_url.rstrip('/')}/{path.lstrip('/')}"
    query_params = str(request.url.query)
    if query_params:
        target_url += f"?{query_params}"

    body = await request.body()
    headers = {
        "X-User-ID": str(current_user.id),
        "X-User-Role": current_user.role,
        "X-Organization-ID": str(current_user.organization_id or ""),
        "Content-Type": request.headers.get("content-type", "application/json"),
        "Accept": request.headers.get("accept", "application/json"),
    }
    if current_user.organization_id:
        headers["X-Organization-ID"] = str(current_user.organization_id)

    async with AsyncClient(timeout=30.0) as client:
        try:
            resp = await client.request(
                method=request.method,
                url=target_url,
                headers=headers,
                content=body,
                follow_redirects=True,
            )
            return Response(
                content=resp.content,
                status_code=resp.status_code,
                headers=dict(resp.headers),
            )
        except HTTPStatusError as e:
            return Response(
                content=e.response.content,
                status_code=e.response.status_code,
                headers=dict(e.response.headers),
            )
        except RequestError as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Service '{service}' unreachable: {str(e)}",
            )


@router.api_route("/{service}/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def proxy_to_service(
    service: str,
    path: str,
    request: Request,
    current_user: User = Depends(get_current_user),
):
    return await _proxy_request(service, path, request, current_user)


@router.get("/health/{service}")
async def proxy_health_check(service: str):
    base_url = SERVICE_MAP.get(service)
    if not base_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown service: {service}",
        )
    async with AsyncClient(timeout=5.0) as client:
        try:
            resp = await client.get(f"{base_url.rstrip('/')}/health")
            return Response(
                content=resp.content,
                status_code=resp.status_code,
            )
        except RequestError:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Service '{service}' unreachable",
            )
