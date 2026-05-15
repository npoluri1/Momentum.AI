from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet, TaskViewSet, TaskListViewSet,
    CommentViewSet, AttachmentViewSet, TimeEntryViewSet,
    TagViewSet, ProjectTemplateViewSet,
)

router = DefaultRouter()
router.register(r"projects", ProjectViewSet, basename="project")
router.register(r"tasks", TaskViewSet, basename="task")
router.register(r"task-lists", TaskListViewSet, basename="task-list")
router.register(r"comments", CommentViewSet, basename="comment")
router.register(r"attachments", AttachmentViewSet, basename="attachment")
router.register(r"time-entries", TimeEntryViewSet, basename="time-entry")
router.register(r"tags", TagViewSet, basename="tag")
router.register(r"templates", ProjectTemplateViewSet, basename="template")

urlpatterns = [
    path("", include(router.urls)),
]
