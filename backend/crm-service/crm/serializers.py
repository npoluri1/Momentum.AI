from rest_framework import serializers
from .models import Lead, Contact, Deal, Pipeline, PipelineStage, Activity, Note


class PipelineStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PipelineStage
        fields = "__all__"
        read_only_fields = ("id", "pipeline")


class PipelineSerializer(serializers.ModelSerializer):
    stages = PipelineStageSerializer(many=True, read_only=True)

    class Meta:
        model = Pipeline
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")


class LeadListSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    assigned_to_name = serializers.SerializerMethodField()

    class Meta:
        model = Lead
        fields = (
            "id", "first_name", "last_name", "full_name", "email",
            "phone", "company", "status", "source", "score",
            "assigned_to", "assigned_to_name", "created_at", "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return obj.assigned_to.get_full_name() or obj.assigned_to.email
        return None


class LeadDetailSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    assigned_to_name = serializers.SerializerMethodField()
    tags = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Lead
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at", "organization")

    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return obj.assigned_to.get_full_name() or obj.assigned_to.email
        return None


class ContactListSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Contact
        fields = (
            "id", "first_name", "last_name", "full_name", "email",
            "phone", "company", "job_title", "created_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class ContactDetailSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Contact
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at", "organization")


class DealListSerializer(serializers.ModelSerializer):
    stage_name = serializers.CharField(source="stage.name", read_only=True)
    pipeline_name = serializers.CharField(source="pipeline.name", read_only=True)
    assigned_to_name = serializers.SerializerMethodField()

    class Meta:
        model = Deal
        fields = (
            "id", "name", "amount", "currency", "stage", "stage_name",
            "pipeline", "pipeline_name", "probability", "close_date",
            "assigned_to", "assigned_to_name", "created_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return obj.assigned_to.get_full_name() or obj.assigned_to.email
        return None


class DealDetailSerializer(serializers.ModelSerializer):
    stage_name = serializers.CharField(source="stage.name", read_only=True)
    pipeline_name = serializers.CharField(source="pipeline.name", read_only=True)

    class Meta:
        model = Deal
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at", "organization")


class ActivitySerializer(serializers.ModelSerializer):
    performed_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at", "organization")

    def get_performed_by_name(self, obj):
        if obj.performed_by:
            return obj.performed_by.get_full_name() or obj.performed_by.email
        return None


class NoteSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Note
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at", "organization")

    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.get_full_name() or obj.created_by.email
        return None
