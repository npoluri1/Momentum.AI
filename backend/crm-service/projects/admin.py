from django.contrib import admin

from .models import Tag, ProjectTemplate, Project, TaskList, Task, Comment, Attachment, TimeEntry

class TaskListInline(admin.TabularInline):
    model = TaskList
    extra = 1
    ordering = ("order",)

class TaskInline(admin.TabularInline):
    model = Task
    extra = 1
    fields = ("title", "status", "priority", "assignee", "due_date", "order")
    ordering = ("order",)

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "color", "organization")
    list_filter = ("organization",)
    search_fields = ("name",)

@admin.register(ProjectTemplate)
class ProjectTemplateAdmin(admin.ModelAdmin):
    list_display = ("name", "organization", "is_public", "created_at")
    list_filter = ("is_public", "organization")
    search_fields = ("name", "description")

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "status", "priority", "owner", "organization", "start_date", "end_date", "created_at")
    list_filter = ("status", "priority", "organization")
    search_fields = ("name", "description")
    readonly_fields = ("created_at", "updated_at")
    inlines = [TaskListInline]

@admin.register(TaskList)
class TaskListAdmin(admin.ModelAdmin):
    list_display = ("name", "project", "order", "created_at")
    list_filter = ("project__organization",)
    search_fields = ("name",)

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "priority", "assignee", "project", "task_list", "due_date", "created_at")
    list_filter = ("status", "priority", "project__organization")
    search_fields = ("title", "description")
    readonly_fields = ("created_at", "updated_at")

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("truncated_content", "task", "author", "is_edited", "created_at")
    list_filter = ("task__project__organization",)
    search_fields = ("content",)

    def truncated_content(self, obj):
        return obj.content[:75] + "..." if len(obj.content) > 75 else obj.content
    truncated_content.short_description = "Content"

@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display = ("filename", "file_size", "task", "uploaded_by", "created_at")
    list_filter = ("task__project__organization",)
    search_fields = ("filename",)

@admin.register(TimeEntry)
class TimeEntryAdmin(admin.ModelAdmin):
    list_display = ("task", "user", "hours", "date", "billable")
    list_filter = ("billable", "task__project__organization")
    search_fields = ("description",)
    readonly_fields = ("created_at", "updated_at")
