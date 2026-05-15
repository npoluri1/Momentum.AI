import django_filters
from django.db import models
from .models import Project, Task, TaskList, Comment, TimeEntry


class ProjectFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=Project.STATUS_CHOICES)
    priority = django_filters.ChoiceFilter(choices=Project.PRIORITY_CHOICES)
    owner = django_filters.NumberFilter()
    team = django_filters.NumberFilter()
    start_date_after = django_filters.DateFilter(
        field_name="start_date", lookup_expr="gte"
    )
    start_date_before = django_filters.DateFilter(
        field_name="start_date", lookup_expr="lte"
    )
    end_date_after = django_filters.DateFilter(
        field_name="end_date", lookup_expr="gte"
    )
    end_date_before = django_filters.DateFilter(
        field_name="end_date", lookup_expr="lte"
    )
    search = django_filters.CharFilter(
        field_name="name", lookup_expr="icontains"
    )

    class Meta:
        model = Project
        fields = [
            "status", "priority", "owner", "team", "organization",
        ]


class TaskFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=Task.STATUS_CHOICES)
    priority = django_filters.ChoiceFilter(choices=Task.PRIORITY_CHOICES)
    assignee = django_filters.NumberFilter()
    project = django_filters.NumberFilter()
    task_list = django_filters.NumberFilter()
    due_date_after = django_filters.DateFilter(
        field_name="due_date", lookup_expr="gte"
    )
    due_date_before = django_filters.DateFilter(
        field_name="due_date", lookup_expr="lte"
    )
    is_overdue = django_filters.BooleanFilter(method="filter_overdue")
    search = django_filters.CharFilter(method="filter_search")

    class Meta:
        model = Task
        fields = [
            "status", "priority", "assignee", "project",
            "task_list", "parent",
        ]

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(title__icontains=value)
            | models.Q(description__icontains=value)
        )

    def filter_overdue(self, queryset, name, value):
        from django.utils import timezone
        if value:
            return queryset.filter(
                due_date__lt=timezone.now().date()
            ).exclude(status="done")
        return queryset


class TaskListFilter(django_filters.FilterSet):
    project = django_filters.NumberFilter()

    class Meta:
        model = TaskList
        fields = ["project"]


class TimeEntryFilter(django_filters.FilterSet):
    user = django_filters.NumberFilter()
    task = django_filters.NumberFilter()
    date_after = django_filters.DateFilter(
        field_name="date", lookup_expr="gte"
    )
    date_before = django_filters.DateFilter(
        field_name="date", lookup_expr="lte"
    )
    billable = django_filters.BooleanFilter()

    class Meta:
        model = TimeEntry
        fields = ["user", "task", "billable", "date"]


class CommentFilter(django_filters.FilterSet):
    task = django_filters.NumberFilter()
    author = django_filters.NumberFilter()

    class Meta:
        model = Comment
        fields = ["task", "author"]
