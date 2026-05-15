import json
from typing import Any, Optional

import redis.asyncio as aioredis

from app.config import get_settings

settings = get_settings()


class CacheService:
    def __init__(self):
        self._client: Optional[aioredis.Redis] = None

    async def connect(self):
        if self._client is None:
            self._client = aioredis.from_url(
                settings.REDIS_URL,
                password=settings.REDIS_PASSWORD,
                db=settings.REDIS_DB,
                socket_timeout=settings.REDIS_SOCKET_TIMEOUT,
                socket_connect_timeout=settings.REDIS_SOCKET_CONNECT_TIMEOUT,
                decode_responses=True,
            )

    async def disconnect(self):
        if self._client:
            await self._client.aclose()
            self._client = None

    async def get(self, key: str) -> Any | None:
        if not self._client:
            return None
        value = await self._client.get(key)
        if value is None:
            return None
        try:
            return json.loads(value)
        except (json.JSONDecodeError, TypeError):
            return value

    async def set(
        self,
        key: str,
        value: Any,
        ttl: int | None = 300,
    ) -> bool:
        if not self._client:
            return False
        serialized = json.dumps(value, default=str)
        if ttl is not None:
            return await self._client.setex(key, ttl, serialized)
        return await self._client.set(key, serialized)

    async def delete(self, key: str) -> bool:
        if not self._client:
            return False
        return bool(await self._client.delete(key))

    async def invalidate_pattern(self, pattern: str) -> int:
        if not self._client:
            return 0
        cursor = 0
        deleted = 0
        while True:
            cursor, keys = await self._client.scan(
                cursor=cursor, match=pattern, count=100
            )
            if keys:
                deleted += await self._client.delete(*keys)
            if cursor == 0:
                break
        return deleted

    async def exists(self, key: str) -> bool:
        if not self._client:
            return False
        return bool(await self._client.exists(key))

    async def expire(self, key: str, ttl: int) -> bool:
        if not self._client:
            return False
        return await self._client.expire(key, ttl)


cache_service = CacheService()
