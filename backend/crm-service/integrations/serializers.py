from rest_framework import serializers

from .models import Integration, IntegrationProvider


class IntegrationProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntegrationProvider
        fields = "__all__"


class IntegrationSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(
        source="provider.display_name", read_only=True
    )
    provider_icon = serializers.CharField(
        source="provider.icon", read_only=True
    )
    provider_category = serializers.CharField(
        source="provider.category", read_only=True
    )

    class Meta:
        model = Integration
        fields = (
            "id", "provider", "provider_name", "provider_icon",
            "provider_category", "name", "config", "is_connected",
            "last_sync_at", "created_at", "updated_at",
        )
        read_only_fields = (
            "id", "is_connected", "last_sync_at",
            "created_at", "updated_at", "organization",
        )


class IntegrationConnectSerializer(serializers.Serializer):
    config = serializers.JSONField(default=dict)
    credentials = serializers.JSONField(default=dict)
