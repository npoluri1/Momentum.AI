import time
import logging
from datetime import datetime, timezone

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

logger = logging.getLogger("api_gateway")


class LoggingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.time()
        request_id = request.headers.get("X-Request-ID", "")
        trace_id = request.headers.get("X-Trace-ID", "")

        body = None
        if request.method in ("POST", "PUT", "PATCH"):
            try:
                body = await request.json()
            except Exception:
                body = None

        logger.info(
            "request_start",
            extra={
                "request_id": request_id,
                "trace_id": trace_id,
                "method": request.method,
                "path": request.url.path,
                "query": str(request.url.query),
                "client_ip": request.client.host if request.client else None,
                "user_agent": request.headers.get("user-agent", ""),
                "body_preview": str(body)[:500] if body else None,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            },
        )

        try:
            response = await call_next(request)
        except Exception as exc:
            elapsed = time.time() - start_time
            logger.error(
                "request_error",
                extra={
                    "request_id": request_id,
                    "trace_id": trace_id,
                    "method": request.method,
                    "path": request.url.path,
                    "elapsed_seconds": round(elapsed, 4),
                    "error": str(exc),
                },
            )
            raise

        elapsed = time.time() - start_time
        response.headers["X-Response-Time"] = f"{elapsed:.4f}s"
        if request_id:
            response.headers["X-Request-ID"] = request_id

        log_level = logging.WARNING if response.status_code >= 400 else logging.INFO
        logger.log(
            log_level,
            "request_complete",
            extra={
                "request_id": request_id,
                "trace_id": trace_id,
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "elapsed_seconds": round(elapsed, 4),
                "content_length": response.headers.get("content-length", 0),
            },
        )

        return response
