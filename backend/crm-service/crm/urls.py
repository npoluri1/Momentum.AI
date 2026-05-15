from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LeadViewSet, ContactViewSet, DealViewSet,
    PipelineViewSet, PipelineStageViewSet,
    ActivityViewSet, NoteViewSet,
)

router = DefaultRouter()
router.register(r"leads", LeadViewSet, basename="lead")
router.register(r"contacts", ContactViewSet, basename="contact")
router.register(r"deals", DealViewSet, basename="deal")
router.register(r"pipelines", PipelineViewSet, basename="pipeline")
router.register(r"pipeline-stages", PipelineStageViewSet, basename="pipeline-stage")
router.register(r"activities", ActivityViewSet, basename="activity")
router.register(r"notes", NoteViewSet, basename="note")

urlpatterns = [
    path("", include(router.urls)),
]
