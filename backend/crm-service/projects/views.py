from django.db import models as db_models
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import (
    Project, Task, TaskList, Comment,
    Attachment, TimeEntry, Tag, ProjectTemplate,
)
from .serializers import (
    ProjectListSerializer, ProjectDetailSerializer,
    TaskSerializer, TaskDetailSerializer,
    TaskListSerializer, TaskListDetailSerializer,
    CommentSerializer, AttachmentSerializer,
    TimeEntrySerializer, TagSerializer,
    ProjectTemplateSerializer,
)
from .filters import (
    ProjectFilter, TaskFilter, TaskListFilter,
    TimeEntryFilter, CommentFilter,
)


class IsOrganizationMember(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        org = getattr(obj, "organization", None)
        if org is None:
            obj = getattr(obj, "project", None)
            if obj:
                org = getattr(obj, "organization", None)
        if org is None:
            return True
        return request.user.organization == org


class TagViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMember]
    serializer_class = TagSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["name"]
    ordering = ["name"]

    def get_queryset(self):
        return Tag.objects.filter(
            organization=self.request.user.organization
        )

    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)


class ProjectTemplateViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMember]
    serializer_class = ProjectTemplateSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["name", "description"]
    ordering = ["name"]

    def get_queryset(self):
        user = self.request.user
        return ProjectTemplate.objects.filter(
            db_models.Q(organization=user.organization)
            | db_models.Q(is_public=True)
        )

    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)


class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMember]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProjectFilter
    search_fields = ["name", "description"]
    ordering_fields = [
        "created_at", "updated_at", "name",
        "start_date", "end_date", "priority",
    ]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action == "list":
            return ProjectListSerializer
        return ProjectDetailSerializer

    def get_queryset(self):
        return Project.objects.filter(
            organization=self.request.user.organization
        ).select_related("owner", "team")

    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)

    @action(detail=True, methods=["post"])
    def update_status(self, request, pk=None):
        project = self.get_object()
        status_value = request.data.get("status")
        if status_value not in dict(Project.STATUS_CHOICES):
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        project.status = status_value
        project.save(update_fields=["status"])
        return Response({"status": status_value})

    @action(detail=False, methods=["get"])
    def summary(self, request):
        qs = self.get_queryset()
        return Response({
            "total": qs.count(),
            "active": qs.filter(status="active").count(),
            "planning": qs.filter(status="planning").count(),
            "on_hold": qs.filter(status="on_hold").count(),
            "completed": qs.filter(status="completed").count(),
            "cancelled": qs.filter(status="cancelled").count(),
        })

    @action(detail=True, methods=["get"])
    def kanban(self, request, pk=None):
        project = self.get_object()
        task_lists = project.task_lists.all()
        data = []
        for tl in task_lists:
            tasks = TaskSerializer(
                tl.tasks.all(), many=True, context={"request": request}
            ).data
            data.append({
                "id": str(tl.id),
                "name": tl.name,
                "tasks": tasks,
            })
        # Include tasks without a list
        unassigned = Task.objects.filter(
            project=project, task_list__isnull=True
        )
        if unassigned.exists():
            data.insert(0, {
                "id": "unassigned",
                "name": "Unassigned",
                "tasks": TaskSerializer(
                    unassigned, many=True, context={"request": request}
                ).data,
            })
        return Response(data)

    @action(detail=True, methods=["get"])
    def timeline(self, request, pk=None):
        project = self.get_object()
        tasks = project.tasks.all()
        return Response(
            TaskSerializer(
                tasks, many=True, context={"request": request}
            ).data
        )


class TaskListViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMember]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = TaskListFilter
    ordering = ["order", "name"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return TaskListDetailSerializer
        return TaskListSerializer

    def get_queryset(self):
        return TaskList.objects.filter(
            project__organization=self.request.user.organization
        ).prefetch_related("tasks")

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=["post"])
    def reorder(self, request, pk=None):
        task_list = self.get_object()
        task_ids = request.data.get("task_ids", [])
        for i, task_id in enumerate(task_ids):
            Task.objects.filter(id=task_id, task_list=task_list).update(
                order=i
            )
        return Response({"status": "reordered"})


class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMember]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = TaskFilter
    search_fields = ["title", "description"]
    ordering_fields = [
        "created_at", "updated_at", "due_date",
        "priority", "order", "story_points",
    ]
    ordering = ["order", "-created_at"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return TaskDetailSerializer
        return TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(
            project__organization=self.request.user.organization
        ).select_related("assignee", "project", "task_list")

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["post"])
    def update_status(self, request, pk=None):
        task = self.get_object()
        status_value = request.data.get("status")
        if status_value not in dict(Task.STATUS_CHOICES):
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        task.status = status_value
        task.save(update_fields=["status"])
        return Response({"status": status_value})

    @action(detail=True, methods=["post"])
    def assign(self, request, pk=None):
        task = self.get_object()
        user_id = request.data.get("user_id")
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            user = User.objects.get(
                id=user_id,
                organization=self.request.user.organization,
            )
            task.assignee = user
            task.save(update_fields=["assignee"])
            return Response({"assignee": user.email})
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=False, methods=["get"])
    def my_tasks(self, request):
        tasks = self.get_queryset().filter(assignee=request.user)
        status_filter = request.query_params.get("status")
        if status_filter:
            tasks = tasks.filter(status=status_filter)
        page = self.paginate_queryset(tasks)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def overdue(self, request):
        tasks = self.get_queryset().filter(
            due_date__lt=timezone.now().date()
        ).exclude(status="done")
        page = self.paginate_queryset(tasks)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def kanban(self, request):
        project_id = request.query_params.get("project")
        tasks = self.get_queryset()
        if project_id:
            tasks = tasks.filter(project_id=project_id)

        grouped = {"todo": [], "in_progress": [], "review": [], "done": []}
        for task in tasks:
            status_key = task.status if task.status in grouped else "todo"
            grouped[status_key].append(
                TaskSerializer(task, context={"request": request}).data
            )
        return Response(
            [{"status": k, "tasks": v} for k, v in grouped.items()]
        )


class CommentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMember]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = CommentFilter
    ordering = ["created_at"]
    serializer_class = CommentSerializer

    def get_queryset(self):
        return Comment.objects.filter(
            task__project__organization=self.request.user.organization
        ).select_related("author")

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=["patch"])
    def edit(self, request, pk=None):
        comment = self.get_object()
        if comment.author != request.user:
            return Response(
                {"error": "Not your comment"},
                status=status.HTTP_403_FORBIDDEN,
            )
        content = request.data.get("content")
        if content:
            comment.content = content
            comment.is_edited = True
            comment.save(update_fields=["content", "is_edited"])
        return Response(CommentSerializer(comment).data)


class AttachmentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMember]
    serializer_class = AttachmentSerializer
    ordering = ["-created_at"]

    def get_queryset(self):
        return Attachment.objects.filter(
            task__project__organization=self.request.user.organization
        )

    def perform_create(self, serializer):
        attachment = serializer.save(uploaded_by=self.request.user)
        attachment.filename = attachment.file.name
        attachment.file_size = attachment.file.size
        attachment.save(
            update_fields=["filename", "file_size"]
        )


class TimeEntryViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMember]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = TimeEntryFilter
    ordering = ["-date"]
    serializer_class = TimeEntrySerializer

    def get_queryset(self):
        return TimeEntry.objects.filter(
            task__project__organization=self.request.user.organization
        ).select_related("user", "task")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"])
    def my_entries(self, request):
        entries = self.get_queryset().filter(user=request.user)
        page = self.paginate_queryset(entries)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(entries, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def summary(self, request):
        qs = self.get_queryset()
        total = qs.aggregate(
            total_hours=db_models.Sum("hours")
        )["total_hours"] or 0
        return Response({"total_hours": str(total)})
