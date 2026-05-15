from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    WorkflowViewSet, WorkflowStepViewSet,
    WorkflowExecutionViewSet,
)

router = DefaultRouter()
router.register(r"workflows", WorkflowViewSet, basename="workflow")
router.register(r"steps", WorkflowStepViewSet, basename="workflow-step")
router.register(
    r"executions", WorkflowExecutionViewSet, basename="workflow-execution"
)

urlpatterns = [
    path("", include(router.urls)),
]
