from django.contrib.auth import get_user_model, authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Organization, Team, Invitation

User = get_user_model()


class OrganizationSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")

    def get_member_count(self, obj):
        return obj.members.count()


class TeamSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at", "organization")

    def get_member_count(self, obj):
        return obj.members.count()


class TeamDetailSerializer(serializers.ModelSerializer):
    members = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Team
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at", "organization")


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    organization_name = serializers.CharField(
        source="organization.name", read_only=True
    )

    class Meta:
        model = User
        fields = (
            "id", "email", "first_name", "last_name", "full_name",
            "organization", "organization_name", "role", "phone",
            "avatar", "job_title", "is_active", "created_at", "updated_at",
        )
        read_only_fields = (
            "id", "is_active", "created_at", "updated_at",
        )

    def get_full_name(self, obj):
        return obj.get_full_name()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    organization_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = (
            "email", "password", "first_name", "last_name",
            "organization_name", "job_title",
        )

    def create(self, validated_data):
        org_name = validated_data.pop("organization_name", None)
        if not org_name:
            org_name = f"{validated_data['email']}'s Organization"

        org = Organization.objects.create(
            name=org_name,
            slug=org_name.lower().replace(" ", "-")[:50],
        )
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            job_title=validated_data.get("job_title", ""),
            organization=org,
            role="admin",
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={"input_type": "password"})

    def validate(self, data):
        user = authenticate(
            request=self.context.get("request"),
            email=data.get("email"),
            password=data.get("password"),
        )
        if not user:
            raise serializers.ValidationError(
                _("Unable to log in with provided credentials."),
            )
        if not user.is_active:
            raise serializers.ValidationError(
                _("User account is disabled."),
            )
        data["user"] = user
        return data


class TokenObtainSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data


class InvitationSerializer(serializers.ModelSerializer):
    invited_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Invitation
        fields = "__all__"
        read_only_fields = (
            "id", "invited_by", "token", "status",
            "created_at", "updated_at", "organization",
        )

    def get_invited_by_name(self, obj):
        return obj.invited_by.get_full_name()


class InvitationCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    role = serializers.ChoiceField(
        choices=["admin", "manager", "member", "viewer"], default="member"
    )
    message = serializers.CharField(required=False, default="")


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
