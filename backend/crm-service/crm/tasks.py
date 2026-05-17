from celery import shared_task
from django.utils import timezone
from django.db import transaction


@shared_task
def send_invitation_email(invitation_id: str) -> dict:
    from .models import Notification
    notification = Notification.objects.filter(id=invitation_id).first()
    if not notification:
        return {"status": "error", "message": "Invitation not found"}
    # Simulate email sending
    print(f"[TASK] Sending invitation email: {notification}")
    return {"status": "sent", "notification_id": str(invitation_id)}


@shared_task
def cleanup_expired_invitations() -> dict:
    from .models import Invitation
    now = timezone.now()
    expired = Invitation.objects.filter(
        status="pending", expires_at__lte=now
    )
    count = expired.count()
    expired.update(status="expired")
    return {"status": "ok", "expired_count": count}


@shared_task
def update_deal_probabilities() -> dict:
    from .models import Deal, PipelineStage
    updated = 0
    for deal in Deal.objects.select_related("stage").iterator():
        stage_prob = deal.stage.probability
        if deal.probability != stage_prob:
            Deal.objects.filter(id=deal.id).update(probability=stage_prob)
            updated += 1
    return {"status": "ok", "updated_deals": updated}


@shared_task
def generate_daily_summary(organization_id: str) -> dict:
    print(f"[TASK] Generating daily summary for org {organization_id}")
    from .models import Deal, Lead
    deals = Deal.objects.filter(organization_id=organization_id)
    leads = Lead.objects.filter(organization_id=organization_id)
    return {
        "status": "ok",
        "total_deals": deals.count(),
        "total_leads": leads.count(),
        "organization_id": str(organization_id),
    }


@shared_task
def sync_integration_data(integration_id: str) -> dict:
    print(f"[TASK] Syncing integration data for integration {integration_id}")
    return {"status": "synced", "integration_id": str(integration_id)}
