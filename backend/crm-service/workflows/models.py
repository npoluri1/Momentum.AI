import uuid
from django.db import models
from django.conf import settings


class Workflow(models.Model):
    TRIGGER_CHOICES = [
        ("lead_created", "Lead Created"),
        ("lead_status_changed", "Lead Status Changed"),
        ("deal_created", "Deal Created"),
        ("deal_stage_changed", "Deal Stage Changed"),
        ("task_created", "Task Created"),
        ("task_status_changed", "Task Status Changed"),
        ("task_completed", "Task Completed"),
        ("scheduled", "Scheduled"),
        ("webhook", "Webhook Received"),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    trigger_type = models.CharField(
        max_length=50, choices=TRIGGER_CHOICES
    )
    trigger_config = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)
    organization = models.ForeignKey(
        "accounts.Organization",
        on_delete=models.CASCADE,
        related_name="workflows",
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_workflows",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class WorkflowStep(models.Model):
    ACTION_CHOICES = [
        ("send_email", "Send Email"),
        ("send_notification", "Send Notification"),
        ("update_field", "Update Field"),
        ("assign_user", "Assign User"),
        ("change_status", "Change Status"),
        ("create_task", "Create Task"),
        ("webhook", "Call Webhook"),
        ("delay", "Delay"),
    ]

    workflow = models.ForeignKey(
        Workflow, on_delete=models.CASCADE, related_name="steps"
    )
    order = models.PositiveIntegerField(default=0)
    action_type = models.CharField(
        max_length=50, choices=ACTION_CHOICES
    )
    action_config = models.JSONField(default=dict)
    condition = models.JSONField(null=True, blank=True)
    is_optional = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["workflow", "order"]

    def __str__(self):
        return f"{self.workflow.name} - Step {self.order}: {self.get_action_type_display()}"


class WorkflowExecution(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("running", "Running"),
        ("completed", "Completed"),
        ("failed", "Failed"),
        ("cancelled", "Cancelled"),
    ]

    workflow = models.ForeignKey(
        Workflow, on_delete=models.CASCADE, related_name="executions"
    )
    status = models.CharField(
        max_length=50, choices=STATUS_CHOICES, default="pending"
    )
    trigger_object_type = models.CharField(max_length=100, blank=True, default="")
    trigger_object_id = models.CharField(max_length=255, blank=True, default="")
    context = models.JSONField(default=dict, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Execution {self.id}: {self.workflow.name} - {self.status}"


class WorkflowLog(models.Model):
    LEVEL_CHOICES = [
        ("info", "Info"),
        ("warning", "Warning"),
        ("error", "Error"),
        ("debug", "Debug"),
    ]

    execution = models.ForeignKey(
        WorkflowExecution,
        on_delete=models.CASCADE,
        related_name="logs",
    )
    step = models.ForeignKey(
        WorkflowStep,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="logs",
    )
    level = models.CharField(
        max_length=50, choices=LEVEL_CHOICES, default="info"
    )
    message = models.TextField()
    details = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["execution", "created_at"]

    def __str__(self):
        return f"[{self.level.upper()}] {self.message[:100]}"
