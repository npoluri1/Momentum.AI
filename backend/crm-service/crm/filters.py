import django_filters
from django.db import models
from .models import Lead, Contact, Deal, Pipeline, Activity, Note


class LeadFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=Lead.STATUS_CHOICES)
    source = django_filters.ChoiceFilter(choices=Lead.SOURCE_CHOICES)
    score_min = django_filters.NumberFilter(field_name="score", lookup_expr="gte")
    score_max = django_filters.NumberFilter(field_name="score", lookup_expr="lte")
    assigned_to = django_filters.NumberFilter()
    created_after = django_filters.DateTimeFilter(
        field_name="created_at", lookup_expr="gte"
    )
    created_before = django_filters.DateTimeFilter(
        field_name="created_at", lookup_expr="lte"
    )
    search = django_filters.CharFilter(method="filter_search")

    class Meta:
        model = Lead
        fields = [
            "status", "source", "score", "assigned_to",
            "company", "organization",
        ]

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(first_name__icontains=value)
            | models.Q(last_name__icontains=value)
            | models.Q(email__icontains=value)
            | models.Q(company__icontains=value)
            | models.Q(phone__icontains=value)
        )


class ContactFilter(django_filters.FilterSet):
    created_after = django_filters.DateTimeFilter(
        field_name="created_at", lookup_expr="gte"
    )
    created_before = django_filters.DateTimeFilter(
        field_name="created_at", lookup_expr="lte"
    )
    search = django_filters.CharFilter(method="filter_search")

    class Meta:
        model = Contact
        fields = ["company", "organization", "owner"]

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(first_name__icontains=value)
            | models.Q(last_name__icontains=value)
            | models.Q(email__icontains=value)
            | models.Q(company__icontains=value)
        )


class DealFilter(django_filters.FilterSet):
    amount_min = django_filters.NumberFilter(
        field_name="amount", lookup_expr="gte"
    )
    amount_max = django_filters.NumberFilter(
        field_name="amount", lookup_expr="lte"
    )
    stage = django_filters.NumberFilter()
    pipeline = django_filters.NumberFilter()
    assigned_to = django_filters.NumberFilter()
    close_date_after = django_filters.DateFilter(
        field_name="close_date", lookup_expr="gte"
    )
    close_date_before = django_filters.DateFilter(
        field_name="close_date", lookup_expr="lte"
    )
    search = django_filters.CharFilter(
        field_name="name", lookup_expr="icontains"
    )

    class Meta:
        model = Deal
        fields = [
            "stage", "pipeline", "assigned_to",
            "organization", "currency",
        ]


class ActivityFilter(django_filters.FilterSet):
    activity_type = django_filters.ChoiceFilter(choices=Activity.TYPE_CHOICES)
    date_after = django_filters.DateTimeFilter(
        field_name="date", lookup_expr="gte"
    )
    date_before = django_filters.DateTimeFilter(
        field_name="date", lookup_expr="lte"
    )
    is_completed = django_filters.BooleanFilter()
    lead = django_filters.NumberFilter()
    contact = django_filters.NumberFilter()
    deal = django_filters.NumberFilter()
    performed_by = django_filters.NumberFilter()

    class Meta:
        model = Activity
        fields = [
            "activity_type", "is_completed", "lead",
            "contact", "deal", "performed_by", "organization",
        ]


class PipelineFilter(django_filters.FilterSet):
    class Meta:
        model = Pipeline
        fields = ["organization", "is_default"]


class NoteFilter(django_filters.FilterSet):
    is_pinned = django_filters.BooleanFilter()
    lead = django_filters.NumberFilter()
    contact = django_filters.NumberFilter()
    deal = django_filters.NumberFilter()
    created_by = django_filters.NumberFilter()

    class Meta:
        model = Note
        fields = [
            "is_pinned", "lead", "contact",
            "deal", "created_by", "organization",
        ]
