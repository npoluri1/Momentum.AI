from celery import shared_task
from django.utils import timezone

from .models import Invitation


@shared_task
def cleanup_expired_invitations() -> dict:
    now = timezone.now()
    expired = Invitation.objects.filter(
        status="pending", expires_at__lte=now
    )
    count = expired.count()
    expired.update(status="expired")
    return {"status": "ok", "expired_count": count}


@shared_task
def send_welcome_email(user_id: str) -> dict:
    print(f"[TASK] Sending welcome email to user {user_id}")
    return {"status": "sent", "user_id": str(user_id)}
