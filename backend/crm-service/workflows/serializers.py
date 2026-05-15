from rest_framework import serializers
from .models import Workflow, WorkflowStep, WorkflowExecution, WorkflowLog


class WorkflowStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowStep
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at", "workflow")


class WorkflowListSerializer(serializers.ModelSerializer):
    step_count = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Workflow
        fields = (
            "id", "name", "trigger_type", "is_active",
            "step_count", "created_by_name", "created_at", "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def get_step_count(self, obj):
        return obj.steps.count()

    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.get_full_name() or obj.created_by.email
        return None


class WorkflowDetailSerializer(serializers.ModelSerializer):
    steps = WorkflowStepSerializer(many=True, read_only=True)
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Workflow
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at", "organization")

    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.get_full_name() or obj.created_by.email
        return None


class WorkflowExecutionSerializer(serializers.ModelSerializer):
    workflow_name = serializers.CharField(
        source="workflow.name", read_only=True
    )

    class Meta:
        model = WorkflowExecution
        fields = "__all__"
        read_only_fields = (
            "id", "started_at", "completed_at", "created_at",
        )


class WorkflowLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowLog
        fields = "__all__"
        read_only_fields = ("id", "created_at")
