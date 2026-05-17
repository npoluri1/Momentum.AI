from celery import shared_task
from django.utils import timezone


@shared_task
def update_project_progress(project_id: str) -> dict:
    from .models import Project
    project = Project.objects.filter(id=project_id).first()
    if not project:
        return {"status": "error", "message": "Project not found"}
    total = project.tasks.count()
    done = project.tasks.filter(status="done").count()
    progress = int((done / total) * 100) if total > 0 else 0
    return {
        "status": "ok",
        "project_id": str(project_id),
        "progress": progress,
    }


@shared_task
def check_overdue_tasks() -> dict:
    from .models import Task
    now = timezone.now().date()
    overdue = Task.objects.filter(
        due_date__lt=now,
    ).exclude(status="done").update(status="overdue")
    return {"status": "ok", "overdue_count": overdue}


@shared_task
def generate_project_report(project_id: str) -> dict:
    from .models import Project, Task, TimeEntry
    project = Project.objects.filter(id=project_id).first()
    if not project:
        return {"status": "error", "message": "Project not found"}
    tasks = Task.objects.filter(project=project)
    time_entries = TimeEntry.objects.filter(task__project=project)
    return {
        "status": "ok",
        "project_id": str(project_id),
        "total_tasks": tasks.count(),
        "done_tasks": tasks.filter(status="done").count(),
        "total_hours": float(
            time_entries.aggregate(total=models.Sum("hours"))["total"] or 0
        ),
    }
