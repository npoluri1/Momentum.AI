from celery import shared_task
from django.utils import timezone


@shared_task
def execute_workflow(workflow_id: str, context: dict | None = None) -> dict:
    from .models import Workflow, WorkflowExecution, WorkflowLog
    workflow = Workflow.objects.filter(id=workflow_id, is_active=True).first()
    if not workflow:
        return {"status": "error", "message": "Workflow not found or inactive"}
    execution = WorkflowExecution.objects.create(
        workflow=workflow,
        status="running",
        context=context or {},
        started_at=timezone.now(),
    )
    WorkflowLog.objects.create(
        execution=execution,
        level="info",
        message=f"Workflow '{workflow.name}' execution started",
    )
    success = True
    for step in workflow.steps.all().order_by("order"):
        try:
            # Execute step action
            action_type = step.action_type
            action_config = step.action_config
            print(f"[WORKFLOW] Executing step {step.order}: {action_type}")
        except Exception as e:
            success = False
            WorkflowLog.objects.create(
                execution=execution,
                step=step,
                level="error",
                message=f"Step {step.order} failed: {str(e)}",
            )
            break
    execution.status = "completed" if success else "failed"
    execution.completed_at = timezone.now()
    execution.save(update_fields=["status", "completed_at"])
    WorkflowLog.objects.create(
        execution=execution,
        level="info" if success else "error",
        message="Workflow execution completed",
    )
    return {"status": execution.status, "execution_id": str(execution.id)}


@shared_task
def cleanup_old_executions(days: int = 30) -> dict:
    from .models import WorkflowExecution
    cutoff = timezone.now() - timezone.timedelta(days=days)
    deleted, _ = WorkflowExecution.objects.filter(
        created_at__lt=cutoff
    ).delete()
    return {"status": "ok", "deleted_count": deleted}
