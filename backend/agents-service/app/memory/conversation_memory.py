from typing import Optional
from collections import defaultdict
from datetime import datetime, timezone


class ConversationMemory:
    def __init__(self, max_history: int = 50, max_token_estimate: int = 8000):
        self._sessions: dict[str, list[dict]] = defaultdict(list)
        self.max_history = max_history
        self.max_token_estimate = max_token_estimate

    async def add_message(
        self,
        session_id: str,
        role: str,
        content: str,
        metadata: Optional[dict] = None,
    ):
        message = {
            "role": role,
            "content": content,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        if metadata:
            message["metadata"] = metadata

        self._sessions[session_id].append(message)

        if len(self._sessions[session_id]) > self.max_history:
            self._sessions[session_id] = self._sessions[session_id][-self.max_history:]

    async def get_context(
        self,
        session_id: str,
        recent_n: Optional[int] = None,
    ) -> list[dict]:
        messages = self._sessions.get(session_id, [])
        if recent_n:
            messages = messages[-recent_n:]
        return [
            {"role": m["role"], "content": m["content"]}
            for m in messages
        ]

    async def get_full_history(self, session_id: str) -> list[dict]:
        return list(self._sessions.get(session_id, []))

    async def summarize(self, session_id: str) -> Optional[str]:
        messages = self._sessions.get(session_id, [])
        if not messages:
            return None
        exchange_count = len(messages)
        user_msgs = sum(1 for m in messages if m["role"] == "user")
        assistant_msgs = sum(1 for m in messages if m["role"] == "assistant")
        total_chars = sum(len(m["content"]) for m in messages)
        first_msg = messages[0]["timestamp"] if messages else None
        last_msg = messages[-1]["timestamp"] if messages else None

        return (
            f"Conversation: {exchange_count} messages "
            f"({user_msgs} user, {assistant_msgs} assistant, "
            f"{total_chars} chars). "
            f"From {first_msg} to {last_msg}."
        )

    async def clear_session(self, session_id: str):
        self._sessions.pop(session_id, None)

    async def estimate_tokens(self, session_id: str) -> int:
        messages = self._sessions.get(session_id, [])
        return sum(len(m["content"]) // 4 for m in messages)

    async def trim_to_token_limit(self, session_id: str, max_tokens: Optional[int] = None):
        limit = max_tokens or self.max_token_estimate
        messages = self._sessions.get(session_id, [])
        while messages and await self.estimate_tokens(session_id) > limit:
            messages.pop(0)
