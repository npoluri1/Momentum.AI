from rest_framework import serializers
from .models import (
    Project, Task, TaskList, Comment,
    Attachment, TimeEntry, Tag, ProjectTemplate,
)


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"
        read_only_fields = ("id", "organization")


class ProjectTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTemplate
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at", "organization")


class TaskListSerializer(serializers.ModelSerializer):
    task_count = serializers.SerializerMethodField()

    class Meta:
        model = TaskList
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at", "project")

    def get_task_count(self, obj):
        return obj.tasks.count()


class TaskListDetailSerializer(serializers.ModelSerializer):
    tasks = serializers.SerializerMethodField()

    class Meta:
        model = TaskList
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at", "project")

    def get_tasks(self, obj):
        tasks = obj.tasks.all()
        return TaskSerializer(tasks, many=True).data


class TaskSerializer(serializers.ModelSerializer):
    assignee_name = serializers.SerializerMethodField()
    subtask_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = (
            "id", "created_at", "updated_at", "created_by",
            "logged_hours",
        )

    def get_assignee_name(self, obj):
        if obj.assignee:
            return obj.assignee.get_full_name() or obj.assignee.email
        return None

    def get_subtask_count(self, obj):
        return obj.subtasks.count()

    def get_comment_count(self, obj):
        return obj.comments.count()


class TaskDetailSerializer(serializers.ModelSerializer):
    assignee_name = serializers.SerializerMethodField()
    subtasks = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    attachments = serializers.SerializerMethodField()
    time_entries = serializers.SerializerMethodField()
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = (
            "id", "created_at", "updated_at", "created_by",
            "logged_hours",
        )

    def get_assignee_name(self, obj):
        if obj.assignee:
            return obj.assignee.get_full_name() or obj.assignee.email
        return None

    def get_subtasks(self, obj):
        return TaskSerializer(obj.subtasks.all(), many=True).data

    def get_comments(self, obj):
        return CommentSerializer(obj.comments.all(), many=True).data

    def get_attachments(self, obj):
        return AttachmentSerializer(obj.attachments.all(), many=True).data

    def get_time_entries(self, obj):
        return TimeEntrySerializer(obj.time_entries.all(), many=True).data


class ProjectListSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    team_name = serializers.CharField(source="team.name", read_only=True)
    task_count = serializers.SerializerMethodField()
    progress = serializers.ReadOnlyField()

    class Meta:
        model = Project
        fields = (
            "id", "name", "status", "priority", "start_date",
            "end_date", "owner", "owner_name", "team", "team_name",
            "task_count", "progress", "created_at", "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def get_owner_name(self, obj):
        if obj.owner:
            return obj.owner.get_full_name() or obj.owner.email
        return None

    def get_task_count(self, obj):
        return obj.tasks.count()


class ProjectDetailSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    team_name = serializers.CharField(source="team.name", read_only=True)
    task_lists = serializers.SerializerMethodField()
    tags = TagSerializer(many=True, read_only=True)
    progress = serializers.ReadOnlyField()

    class Meta:
        model = Project
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at", "organization")

    def get_owner_name(self, obj):
        if obj.owner:
            return obj.owner.get_full_name() or obj.owner.email
        return None

    def get_task_lists(self, obj):
        lists = obj.task_lists.all()
        return TaskListDetailSerializer(lists, many=True).data


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = "__all__"
        read_only_fields = (
            "id", "author", "is_edited", "created_at", "updated_at",
        )

    def get_author_name(self, obj):
        return obj.author.get_full_name() or obj.author.email


class AttachmentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Attachment
        fields = "__all__"
        read_only_fields = (
            "id", "uploaded_by", "created_at",
        )

    def get_uploaded_by_name(self, obj):
        return obj.uploaded_by.get_full_name() or obj.uploaded_by.email


class TimeEntrySerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = TimeEntry
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at", "user")

    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.email
