from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone

from .models import Workflow, WorkflowStep, WorkflowExecution, WorkflowLog
from .serializers import (
    WorkflowListSerializer, WorkflowDetailSerializer,
    WorkflowStepSerializer, WorkflowExecutionSerializer,
    WorkflowLogSerializer,
)


class IsOrganizationMember(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        org = getattr(obj, "organization", None)
        if org is None:
            return True
        return request.user.organization == org


class WorkflowViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMember]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["name", "description"]
    ordering_fields = ["created_at", "updated_at", "name"]
    ordering = ["-created_at"]

    filterset_fields = ["trigger_type", "is_active", "organization"]

    def get_serializer_class(self):
        if self.action == "list":
            return WorkflowListSerializer
        return WorkflowDetailSerializer

    def get_queryset(self):
        return Workflow.objects.filter(
            organization=self.request.user.organization
        ).prefetch_related("steps").select_related("created_by")

    def perform_create(self, serializer):
        serializer.save(
            organization=self.request.user.organization,
            created_by=self.request.user,
        )

    @action(detail=True, methods=["post"])
    def toggle(self, request, pk=None):
        workflow = self.get_object()
        workflow.is_active = not workflow.is_active
        workflow.save(update_fields=["is_active"])
        return Response({"is_active": workflow.is_active})

    @action(detail=True, methods=["post"])
    def execute(self, request, pk=None):
        workflow = self.get_object()
        if not workflow.is_active:
            return Response(
                {"error": "Workflow is not active"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        execution = WorkflowExecution.objects.create(
            workflow=workflow,
            status="running",
            context=request.data.get("context", {}),
            trigger_object_type=request.data.get("object_type", ""),
            trigger_object_id=request.data.get("object_id", ""),
            started_at=timezone.now(),
        )
        WorkflowLog.objects.create(
            execution=execution,
            level="info",
            message=f"Workflow '{workflow.name}' execution started",
        )
        execution.status = "completed"
        execution.completed_at = timezone.now()
        execution.save(update_fields=["status", "completed_at"])
        WorkflowLog.objects.create(
            execution=execution,
            level="info",
            message="Workflow execution completed successfully",
        )
        return Response(
            WorkflowExecutionSerializer(execution).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["get"])
    def executions(self, request, pk=None):
        workflow = self.get_object()
        executions = WorkflowExecution.objects.filter(
            workflow=workflow
        )[:50]
        page = self.paginate_queryset(executions)
        if page is not None:
            serializer = WorkflowExecutionSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = WorkflowExecutionSerializer(executions, many=True)
        return Response(serializer.data)


class WorkflowStepViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMember]
    serializer_class = WorkflowStepSerializer
    ordering = ["workflow", "order"]
    filterset_fields = ["workflow", "action_type"]

    def get_queryset(self):
        return WorkflowStep.objects.filter(
            workflow__organization=self.request.user.organization
        )

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=["post"])
    def move(self, request, pk=None):
        step = self.get_object()
        new_order = request.data.get("order")
        if new_order is not None:
            step.order = new_order
            step.save(update_fields=["order"])
        return Response({"order": step.order})


class WorkflowExecutionViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMember]
    serializer_class = WorkflowExecutionSerializer
    ordering = ["-created_at"]
    filterset_fields = ["workflow", "status"]

    def get_queryset(self):
        return WorkflowExecution.objects.filter(
            workflow__organization=self.request.user.organization
        ).select_related("workflow")

    @action(detail=True, methods=["get"])
    def logs(self, request, pk=None):
        execution = self.get_object()
        logs = WorkflowLog.objects.filter(execution=execution)
        return Response(WorkflowLogSerializer(logs, many=True).data)
