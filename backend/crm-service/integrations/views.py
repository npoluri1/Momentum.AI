from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Integration, IntegrationProvider
from .serializers import (
    IntegrationSerializer,
    IntegrationProviderSerializer,
    IntegrationConnectSerializer,
)
from .connectors import get_connector


class IsOrganizationMember(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return request.user.organization == obj.organization


class IntegrationProviderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = IntegrationProvider.objects.filter(is_active=True)
    serializer_class = IntegrationProviderSerializer
    permission_classes = [permissions.IsAuthenticated]
    search_fields = ["name", "display_name", "description"]
    ordering = ["name"]


class IntegrationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMember]
    serializer_class = IntegrationSerializer

    def get_queryset(self):
        return Integration.objects.filter(
            organization=self.request.user.organization
        ).select_related("provider")

    def perform_create(self, serializer):
        serializer.save(
            organization=self.request.user.organization,
            created_by=self.request.user,
        )

    @action(detail=True, methods=["post"])
    def connect(self, request, pk=None):
        integration = self.get_object()
        serializer = IntegrationConnectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        integration.config = serializer.validated_data.get("config", {})
        integration.credentials = serializer.validated_data.get("credentials", {})
        integration.is_connected = True
        integration.save(update_fields=["config", "credentials", "is_connected"])
        return Response(IntegrationSerializer(integration).data)

    @action(detail=True, methods=["post"])
    def disconnect(self, request, pk=None):
        integration = self.get_object()
        integration.is_connected = False
        integration.credentials = {}
        integration.save(update_fields=["is_connected", "credentials"])
        return Response(IntegrationSerializer(integration).data)

    @action(detail=True, methods=["post"])
    def sync(self, request, pk=None):
        integration = self.get_object()
        if not integration.is_connected:
            return Response(
                {"error": "Integration is not connected"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        connector = get_connector(
            integration.provider.name,
            integration.config,
            integration.credentials,
        )
        if not connector:
            return Response(
                {"error": f"No connector for provider: {integration.provider.name}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        result = connector.sync()
        from django.utils import timezone
        integration.last_sync_at = timezone.now()
        integration.save(update_fields=["last_sync_at"])
        return Response(result)

    @action(detail=True, methods=["get"])
    def status(self, request, pk=None):
        integration = self.get_object()
        if not integration.is_connected:
            return Response({"connected": False, "provider": integration.provider.name})
        connector = get_connector(
            integration.provider.name,
            integration.config,
            integration.credentials,
        )
        connected = connector.test_connection() if connector else False
        return Response({
            "connected": connected,
            "provider": integration.provider.name,
            "last_sync_at": integration.last_sync_at,
        })
