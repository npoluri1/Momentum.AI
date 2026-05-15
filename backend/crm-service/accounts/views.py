from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db import transaction
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Organization, Team, Invitation
from .serializers import (
    OrganizationSerializer, TeamSerializer, TeamDetailSerializer,
    UserSerializer, RegisterSerializer, LoginSerializer,
    TokenObtainSerializer, InvitationSerializer,
    InvitationCreateSerializer, PasswordChangeSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    serializer_class = TokenObtainSerializer


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def login_view(request):
    serializer = LoginSerializer(
        data=request.data, context={"request": request}
    )
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data["user"]
    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
    )


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.organization:
            return User.objects.filter(organization=user.organization)
        return User.objects.filter(id=user.id)

    @action(detail=False, methods=["get", "patch"])
    def me(self, request):
        if request.method == "PATCH":
            serializer = self.get_serializer(
                request.user, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        return Response(UserSerializer(request.user).data)

    @action(detail=False, methods=["post"])
    def change_password(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        if not user.check_password(serializer.validated_data["old_password"]):
            return Response(
                {"old_password": "Wrong password."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])
        return Response({"status": "password changed"})

    @action(detail=False, methods=["post"])
    def logout(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception:
            pass
        return Response({"status": "logged out"})


class OrganizationViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Organization.objects.all()
        return Organization.objects.filter(id=user.organization_id)

    def perform_create(self, serializer):
        org = serializer.save()
        self.request.user.organization = org
        self.request.user.role = "admin"
        self.request.user.save(update_fields=["organization", "role"])

    @action(detail=True, methods=["post"])
    def invite(self, request, pk=None):
        org = self.get_object()
        serializer = InvitationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if Invitation.objects.filter(
            email=serializer.validated_data["email"],
            organization=org,
            status="pending",
        ).exists():
            return Response(
                {"error": "Invitation already pending for this email"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        invitation = Invitation.objects.create(
            email=serializer.validated_data["email"],
            organization=org,
            invited_by=request.user,
            role=serializer.validated_data.get("role", "member"),
            message=serializer.validated_data.get("message", ""),
            expires_at=timezone.now() + timezone.timedelta(days=7),
        )
        return Response(
            InvitationSerializer(invitation).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["get"])
    def invitations(self, request, pk=None):
        org = self.get_object()
        invitations = Invitation.objects.filter(organization=org)
        return Response(
            InvitationSerializer(invitations, many=True).data
        )

    @action(detail=True, methods=["get"])
    def members(self, request, pk=None):
        org = self.get_object()
        members = User.objects.filter(organization=org)
        return Response(UserSerializer(members, many=True).data)


class TeamViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return TeamDetailSerializer
        return TeamSerializer

    def get_queryset(self):
        return Team.objects.filter(
            organization=self.request.user.organization
        ).prefetch_related("members")

    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)

    @action(detail=True, methods=["post"])
    def add_member(self, request, pk=None):
        team = self.get_object()
        user_id = request.data.get("user_id")
        try:
            user = User.objects.get(
                id=user_id,
                organization=self.request.user.organization,
            )
            team.members.add(user)
            return Response({"status": "member added"})
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=True, methods=["post"])
    def remove_member(self, request, pk=None):
        team = self.get_object()
        user_id = request.data.get("user_id")
        team.members.remove(user_id)
        return Response({"status": "member removed"})


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def accept_invitation(request, token):
    try:
        invitation = Invitation.objects.get(
            token=token, status="pending"
        )
    except Invitation.DoesNotExist:
        return Response(
            {"error": "Invalid or expired invitation"},
            status=status.HTTP_404_NOT_FOUND,
        )

    if invitation.expires_at < timezone.now():
        invitation.status = "expired"
        invitation.save(update_fields=["status"])
        return Response(
            {"error": "Invitation has expired"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    email = invitation.email
    try:
        user = User.objects.get(email=email)
        user.organization = invitation.organization
        user.role = invitation.role
        user.save(update_fields=["organization", "role"])
    except User.DoesNotExist:
        return Response(
            {"error": "No account found. Please register first."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    invitation.status = "accepted"
    invitation.save(update_fields=["status"])

    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "message": "Invitation accepted",
        }
    )
