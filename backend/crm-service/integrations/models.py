import uuid
from django.db import models
from django.conf import settings


class IntegrationProvider(models.Model):
    name = models.CharField(max_length=100, unique=True)
    display_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    icon = models.CharField(max_length=50, default="puzzle")
    category = models.CharField(
        max_length=50,
        choices=[
            ("communication", "Communication"),
            ("crm", "CRM & Sales"),
            ("development", "Development"),
            ("storage", "Storage & Files"),
            ("marketing", "Marketing"),
            ("finance", "Finance & Payments"),
            ("other", "Other"),
        ],
        default="other",
    )
    is_active = models.BooleanField(default=True)
    config_schema = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.display_name


class Integration(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.ForeignKey(
        IntegrationProvider, on_delete=models.CASCADE, related_name="integrations"
    )
    organization = models.ForeignKey(
        "accounts.Organization", on_delete=models.CASCADE, related_name="integrations"
    )
    name = models.CharField(max_length=255)
    config = models.JSONField(default=dict, blank=True)
    credentials = models.JSONField(default=dict, blank=True)
    is_connected = models.BooleanField(default=False)
    last_sync_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_integrations",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = ["provider", "organization"]

    def __str__(self):
        return f"{self.provider.display_name} - {self.organization.name}"
