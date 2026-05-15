from django.db import models
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Lead, Contact, Deal, Pipeline, PipelineStage, Activity, Note
from .serializers import (
    LeadListSerializer, LeadDetailSerializer,
    ContactListSerializer, ContactDetailSerializer,
    DealListSerializer, DealDetailSerializer,
    PipelineSerializer, PipelineStageSerializer,
    ActivitySerializer, NoteSerializer,
)
from .filters import (
    LeadFilter, ContactFilter, DealFilter,
    PipelineFilter, ActivityFilter, NoteFilter,
)


class IsOrganizationMember(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        org = getattr(obj, "organization", None)
        if org is None:
            return True
        return request.user.organization == org


class LeadViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMember]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = LeadFilter
    search_fields = [
        "first_name", "last_name", "email",
        "company", "phone", "notes",
    ]
    ordering_fields = [
        "created_at", "updated_at", "score",
        "first_name", "last_name", "email",
    ]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action == "list":
            return LeadListSerializer
        return LeadDetailSerializer

    def get_queryset(self):
        return Lead.objects.filter(
            organization=self.request.user.organization
        ).select_related("assigned_to")

    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)

    @action(detail=True, methods=["post"])
    def convert(self, request, pk=None):
        lead = self.get_object()
        contact, created = Contact.objects.get_or_create(
            email=lead.email,
            defaults={
                "first_name": lead.first_name,
                "last_name": lead.last_name,
                "phone": lead.phone,
                "company": lead.company,
                "job_title": lead.job_title,
                "lead": lead,
                "organization": lead.organization,
                "owner": request.user,
            },
        )
        lead.status = "qualified"
        lead.save(update_fields=["status"])
        return Response(
            {"status": "converted", "contact_id": contact.id},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["get"])
    def summary(self, request):
        qs = self.get_queryset()
        return Response({
            "total": qs.count(),
            "new": qs.filter(status="new").count(),
            "contacted": qs.filter(status="contacted").count(),
            "qualified": qs.filter(status="qualified").count(),
            "won": qs.filter(status="won").count(),
            "lost": qs.filter(status="lost").count(),
        })


class ContactViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMember]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ContactFilter
    search_fields = [
        "first_name", "last_name", "email",
        "company", "phone", "notes",
    ]
    ordering_fields = [
        "created_at", "updated_at",
        "first_name", "last_name", "email",
    ]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action == "list":
            return ContactListSerializer
        return ContactDetailSerializer

    def get_queryset(self):
        return Contact.objects.filter(
            organization=self.request.user.organization
        ).select_related("owner")

    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)


class DealViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMember]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = DealFilter
    search_fields = ["name", "notes"]
    ordering_fields = [
        "created_at", "updated_at", "amount",
        "close_date", "probability",
    ]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action == "list":
            return DealListSerializer
        return DealDetailSerializer

    def get_queryset(self):
        return Deal.objects.filter(
            organization=self.request.user.organization
        ).select_related("stage", "pipeline", "assigned_to")

    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)

    @action(detail=False, methods=["get"])
    def summary(self, request):
        qs = self.get_queryset()
        total_amount = qs.exclude(stage__is_closed_lost=True).aggregate(
            total=models.Sum("amount")
        )["total"] or 0
        return Response({
            "total": qs.count(),
            "total_amount": str(total_amount),
            "won": qs.filter(stage__is_closed_won=True).count(),
            "lost": qs.filter(stage__is_closed_lost=True).count(),
        })


class PipelineViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMember]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = PipelineFilter
    serializer_class = PipelineSerializer
    ordering = ["-is_default", "name"]

    def get_queryset(self):
        return Pipeline.objects.filter(
            organization=self.request.user.organization
        ).prefetch_related("stages")

    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)


class PipelineStageViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMember]
    serializer_class = PipelineStageSerializer

    def get_queryset(self):
        return PipelineStage.objects.filter(
            pipeline__organization=self.request.user.organization
        )

    def perform_create(self, serializer):
        serializer.save()


class ActivityViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMember]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ActivityFilter
    search_fields = ["subject", "description"]
    ordering_fields = ["date", "created_at"]
    ordering = ["-date"]
    serializer_class = ActivitySerializer

    def get_queryset(self):
        return Activity.objects.filter(
            organization=self.request.user.organization
        ).select_related("performed_by")

    def perform_create(self, serializer):
        serializer.save(
            organization=self.request.user.organization,
            performed_by=self.request.user,
        )


class NoteViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMember]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = NoteFilter
    search_fields = ["content"]
    ordering_fields = ["created_at", "-is_pinned"]
    ordering = ["-is_pinned", "-created_at"]
    serializer_class = NoteSerializer

    def get_queryset(self):
        return Note.objects.filter(
            organization=self.request.user.organization
        ).select_related("created_by")

    def perform_create(self, serializer):
        serializer.save(
            organization=self.request.user.organization,
            created_by=self.request.user,
        )
