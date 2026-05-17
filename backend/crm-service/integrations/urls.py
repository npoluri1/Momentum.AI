from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import IntegrationViewSet, IntegrationProviderViewSet

router = DefaultRouter()
router.register(r"integrations", IntegrationViewSet, basename="integration")
router.register(
    r"providers", IntegrationProviderViewSet, basename="integration-provider"
)

urlpatterns = [
    path("", include(router.urls)),
]
