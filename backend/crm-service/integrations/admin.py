from django.contrib import admin

from .models import IntegrationProvider, Integration


@admin.register(IntegrationProvider)
class IntegrationProviderAdmin(admin.ModelAdmin):
    list_display = ("name", "display_name", "category", "is_active")
    list_filter = ("category", "is_active")
    search_fields = ("name", "display_name", "description")


@admin.register(Integration)
class IntegrationAdmin(admin.ModelAdmin):
    list_display = ("provider", "organization", "is_connected", "last_sync_at", "created_at")
    list_filter = ("is_connected", "provider", "organization")
    search_fields = ("name",)
    readonly_fields = ("created_at", "updated_at")
