from django.contrib import admin

from .models import Pipeline, PipelineStage, Lead, Contact, Deal, Activity, Note

class PipelineStageInline(admin.TabularInline):
    model = PipelineStage
    extra = 1
    ordering = ("order",)

@admin.register(Pipeline)
class PipelineAdmin(admin.ModelAdmin):
    list_display = ("name", "organization", "is_default", "created_at")
    list_filter = ("is_default", "organization")
    search_fields = ("name", "description")
    inlines = [PipelineStageInline]

@admin.register(PipelineStage)
class PipelineStageAdmin(admin.ModelAdmin):
    list_display = ("name", "pipeline", "order", "probability", "is_closed_won", "is_closed_lost")
    list_filter = ("pipeline", "is_closed_won", "is_closed_lost")
    ordering = ("pipeline", "order")

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "company", "status", "source", "score", "assigned_to", "created_at")
    list_filter = ("status", "source", "organization")
    search_fields = ("first_name", "last_name", "email", "company")
    readonly_fields = ("created_at", "updated_at")

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "company", "owner", "created_at")
    list_filter = ("organization",)
    search_fields = ("first_name", "last_name", "email", "company")
    readonly_fields = ("created_at", "updated_at")

@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = ("name", "amount", "pipeline", "stage", "probability", "close_date", "assigned_to")
    list_filter = ("pipeline", "stage", "organization")
    search_fields = ("name", "notes")
    readonly_fields = ("created_at", "updated_at")

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("subject", "activity_type", "date", "is_completed", "performed_by")
    list_filter = ("activity_type", "is_completed", "organization")
    search_fields = ("subject", "description")
    readonly_fields = ("created_at", "updated_at")

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ("truncated_content", "is_pinned", "created_by", "created_at")
    list_filter = ("is_pinned", "organization")
    search_fields = ("content",)

    def truncated_content(self, obj):
        return obj.content[:75] + "..." if len(obj.content) > 75 else obj.content
    truncated_content.short_description = "Content"
