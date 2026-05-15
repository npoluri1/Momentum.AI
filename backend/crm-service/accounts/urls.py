from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView, TokenVerifyView, TokenBlacklistView,
)
from .views import (
    RegisterView, UserViewSet, OrganizationViewSet,
    TeamViewSet, login_view, accept_invitation,
)

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")
router.register(r"organizations", OrganizationViewSet, basename="organization")
router.register(r"teams", TeamViewSet, basename="team")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("login/", login_view, name="auth-login"),
    path("token/", login_view, name="token-obtain"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token-verify"),
    path("token/blacklist/", TokenBlacklistView.as_view(), name="token-blacklist"),
    path(
        "invitations/<uuid:token>/accept/",
        accept_invitation,
        name="accept-invitation",
    ),
    path("", include(router.urls)),
]
