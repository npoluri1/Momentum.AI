import json
import os
from abc import ABC, abstractmethod
from typing import Any


class BaseConnector(ABC):
    def __init__(self, config: dict[str, Any], credentials: dict[str, Any]):
        self.config = config
        self.credentials = credentials

    @abstractmethod
    def test_connection(self) -> bool: ...

    @abstractmethod
    def sync(self) -> dict[str, Any]: ...


class SlackConnector(BaseConnector):
    def test_connection(self) -> bool:
        token = self.credentials.get("bot_token") or os.environ.get("SLACK_BOT_TOKEN")
        if not token:
            return False
        return bool(token)

    def sync(self) -> dict[str, Any]:
        return {"status": "simulated", "channels_synced": 0, "messages_synced": 0}

    def send_message(self, channel: str, text: str) -> dict[str, Any]:
        return {"status": "simulated", "channel": channel, "text": text}


class HubSpotConnector(BaseConnector):
    def test_connection(self) -> bool:
        api_key = self.credentials.get("api_key") or os.environ.get("HUBSPOT_API_KEY")
        return bool(api_key)

    def sync(self) -> dict[str, Any]:
        return {"status": "simulated", "contacts_synced": 0, "deals_synced": 0}


class SendGridConnector(BaseConnector):
    def test_connection(self) -> bool:
        api_key = self.credentials.get("api_key") or os.environ.get("SENDGRID_API_KEY")
        return bool(api_key)

    def sync(self) -> dict[str, Any]:
        return {"status": "simulated", "emails_sent": 0}

    def send_email(
        self, to: str, subject: str, body: str
    ) -> dict[str, Any]:
        return {"status": "simulated", "to": to, "subject": subject}


class StripeConnector(BaseConnector):
    def test_connection(self) -> bool:
        secret_key = self.credentials.get("secret_key") or os.environ.get(
            "STRIPE_SECRET_KEY"
        )
        return bool(secret_key)

    def sync(self) -> dict[str, Any]:
        return {
            "status": "simulated",
            "customers_synced": 0,
            "invoices_synced": 0,
            "revenue": 0,
        }


class GitHubConnector(BaseConnector):
    def test_connection(self) -> bool:
        token = self.credentials.get("token")
        return bool(token)

    def sync(self) -> dict[str, Any]:
        return {"status": "simulated", "repos_synced": 0, "issues_synced": 0}


class GoogleDriveConnector(BaseConnector):
    def test_connection(self) -> bool:
        return bool(self.credentials)

    def sync(self) -> dict[str, Any]:
        return {"status": "simulated", "files_synced": 0}


class NotionConnector(BaseConnector):
    def test_connection(self) -> bool:
        token = self.credentials.get("token")
        return bool(token)

    def sync(self) -> dict[str, Any]:
        return {"status": "simulated", "pages_synced": 0}


class JiraConnector(BaseConnector):
    def test_connection(self) -> bool:
        return bool(
            self.credentials.get("email") and self.credentials.get("api_token")
        )

    def sync(self) -> dict[str, Any]:
        return {"status": "simulated", "issues_synced": 0}


class FigmaConnector(BaseConnector):
    def test_connection(self) -> bool:
        token = self.credentials.get("token")
        return bool(token)

    def sync(self) -> dict[str, Any]:
        return {"status": "simulated", "files_synced": 0}


def get_connector(
    provider: str, config: dict[str, Any], credentials: dict[str, Any]
) -> BaseConnector | None:
    mapping: dict[str, type[BaseConnector]] = {
        "slack": SlackConnector,
        "hubspot": HubSpotConnector,
        "sendgrid": SendGridConnector,
        "stripe": StripeConnector,
        "github": GitHubConnector,
        "google_drive": GoogleDriveConnector,
        "notion": NotionConnector,
        "jira": JiraConnector,
        "figma": FigmaConnector,
    }
    cls = mapping.get(provider.lower())
    if cls:
        return cls(config, credentials)
    return None
