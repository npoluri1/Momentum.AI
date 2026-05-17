import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.database import init_db, close_db
from app.middleware.logging import LoggingMiddleware
from app.routes import auth, users, organizations, proxy, workspace_gallery
from app.schemas import ErrorResponse, HealthResponse
from app.services.cache_service import cache_service

settings = get_settings()

logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("api_gateway")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting API Gateway...")
    await init_db()
    await cache_service.connect()
    logger.info(
        "API Gateway started",
        extra={
            "version": settings.APP_VERSION,
            "env": settings.ENV,
            "services": {
                "agents": settings.AGENTS_SERVICE_URL,
                "crm": settings.CRM_SERVICE_URL,
                "workflow": settings.WORKFLOW_ENGINE_URL,
                "realtime": settings.REALTIME_SERVICE_URL,
            },
        },
    )
    yield
    logger.info("Shutting down API Gateway...")
    await cache_service.disconnect()
    await close_db()
    logger.info("API Gateway shut down")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Enterprise API Gateway for Momentum.AI platform",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# ─── CORS ────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID", "X-Response-Time"],
)

# ─── Logging Middleware ──────────────────────────────────────────────
app.add_middleware(LoggingMiddleware)

# ─── Routers ─────────────────────────────────────────────────────────
app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(organizations.router, prefix="/api/v1")
app.include_router(proxy.router, prefix="/api/v1")
app.include_router(workspace_gallery.router)


# ─── Global Exception Handler ────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception", exc_info=exc)
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            message="Internal server error",
            error_code="INTERNAL_ERROR",
        ).model_dump(),
    )


# ─── Health Check ────────────────────────────────────────────────────
@app.get("/health", response_model=HealthResponse)
async def health_check():
    services_status = {}
    for name, url in [
        ("agents", settings.AGENTS_SERVICE_URL),
        ("crm", settings.CRM_SERVICE_URL),
        ("workflow", settings.WORKFLOW_ENGINE_URL),
        ("realtime", settings.REALTIME_SERVICE_URL),
    ]:
        import httpx
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                resp = await client.get(f"{url.rstrip('/')}/health")
                services_status[name] = "healthy" if resp.status_code == 200 else "degraded"
        except Exception:
            services_status[name] = "unreachable"

    overall = "healthy"
    if any(s == "unreachable" for s in services_status.values()):
        overall = "degraded"

    cache_ok = cache_service._client is not None
    return HealthResponse(
        status=overall,
        version=settings.APP_VERSION,
        services={
            **services_status,
            "cache": "healthy" if cache_ok else "disconnected",
            "database": "connected",
        },
    )


# ─── Root ────────────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {"app": settings.APP_NAME, "version": settings.APP_VERSION, "status": "running"}
