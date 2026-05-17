from django.contrib import admin

from .models import Workflow, WorkflowStep, WorkflowExecution, WorkflowLog

class WorkflowStepInline(admin.TabularInline):
    model = WorkflowStep
    extra = 1
    ordering = ("order",)

class WorkflowLogInline(admin.TabularInline):
    model = WorkflowLog
    extra = 0
    readonly_fields = ("level", "message", "details", "created_at")
    can_delete = False
    ordering = ("created_at",)

@admin.register(Workflow)
class WorkflowAdmin(admin.ModelAdmin):
    list_display = ("name", "trigger_type", "is_active", "organization", "created_by", "created_at")
    list_filter = ("trigger_type", "is_active", "organization")
    search_fields = ("name", "description")
    inlines = [WorkflowStepInline]

@admin.register(WorkflowStep)
class WorkflowStepAdmin(admin.ModelAdmin):
    list_display = ("workflow", "order", "action_type", "is_optional")
    list_filter = ("action_type", "workflow__organization")
    ordering = ("workflow", "order")

@admin.register(WorkflowExecution)
class WorkflowExecutionAdmin(admin.ModelAdmin):
    list_display = ("workflow", "status", "started_at", "completed_at", "created_at")
    list_filter = ("status", "workflow__organization")
    readonly_fields = ("started_at", "completed_at", "created_at")
    inlines = [WorkflowLogInline]

@admin.register(WorkflowLog)
class WorkflowLogAdmin(admin.ModelAdmin):
    list_display = ("execution", "level", "truncated_message", "step", "created_at")
    list_filter = ("level", "execution__workflow__organization")
    search_fields = ("message",)

    def truncated_message(self, obj):
        return obj.message[:100] + "..." if len(obj.message) > 100 else obj.message
    truncated_message.short_description = "Message"
