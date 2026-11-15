
from django.contrib.auth import update_session_auth_hash

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from rest_framework.parsers import (
    JSONParser,
    MultiPartParser,
    FormParser,
)

from .models import User

from .serializers import (
    UserReadSerializer,
    UserCreateSerializer,
    UserUpdateSerializer,
    AdminUserUpdateSerializer,
    ChangePasswordSerializer,
)

from .permissions import (
    IsBusinessAdmin,
    IsOwnerOrBusinessAdmin,
)


class UserViewSet(viewsets.ModelViewSet):

    queryset = User.objects.all()

    parser_classes = [
        JSONParser,
        MultiPartParser,
        FormParser,
    ]

    http_method_names = [
        "get",
        "post",
        "patch",
        "head",
        "options",
    ]

    def get_queryset(self):
        user = self.request.user

        queryset = User.objects.all()

        if not user.is_authenticated:
            return queryset.none()

        if not user.is_admin:
            return queryset.filter(
                id=user.id
            )

        return queryset

    def get_permissions(self):

        if self.action == "create":
            return [IsBusinessAdmin()]

        if self.action in [
            "list",
            "activate",
            "deactivate",
        ]:
            return [IsBusinessAdmin()]

        return [
            IsAuthenticated(),
            IsOwnerOrBusinessAdmin(),
        ]

    def get_serializer_class(self):

        if self.action == "create":
            return UserCreateSerializer

        if self.action in [
            "update",
            "partial_update",
        ]:
            if self.request.user.is_admin:
                return AdminUserUpdateSerializer

            return UserUpdateSerializer

        return UserReadSerializer

    def destroy(self, request, *args, **kwargs):
        return Response(
            {
                "detail": (
                    "Employee accounts cannot be deleted. "
                    "Deactivate the account instead."
                )
            },
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAuthenticated],
        url_path="me",
    )
    def me(self, request):
        serializer = UserReadSerializer(
            request.user,
            context={"request": request},
        )

        return Response(serializer.data)

    @action(
        detail=False,
        methods=["patch"],
        permission_classes=[IsAuthenticated],
        url_path="update-me",
    )
    def update_me(self, request):

        serializer = UserUpdateSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(
            UserReadSerializer(
                request.user,
                context={"request": request},
            ).data
        )

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[IsAuthenticated],
        url_path="change-password",
    )
    def change_password(self, request):

        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)

        serializer.save()

        update_session_auth_hash(
            request,
            request.user,
        )

        return Response(
            {
                "detail": "Password changed successfully."
            },
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True,
        methods=["patch"],
        permission_classes=[IsBusinessAdmin],
        url_path="activate",
    )
    def activate(self, request, pk=None):

        employee = self.get_object()

        if employee.is_superuser:
            return Response(
                {"detail": "This account cannot be modified here."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        employee.is_active = True

        employee.save(update_fields=["is_active", "updated_at"])

        return Response({
            "detail": "Employee account activated.",
            "id": str(employee.id),
            "is_active": employee.is_active,
        })

    @action(
        detail=True,
        methods=["patch"],
        permission_classes=[IsBusinessAdmin],
        url_path="deactivate",
    )
    def deactivate(self, request, pk=None):

        employee = self.get_object()

        if employee.id == request.user.id:
            return Response(
                {
                    "detail": (
                        "You cannot deactivate your own account."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if employee.is_superuser:
            return Response(
                {
                    "detail": (
                        "Superuser accounts cannot be "
                        "deactivated through this endpoint."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        employee.is_active = False

        employee.save(update_fields=["is_active", "updated_at"])

        return Response({
            "detail": "Employee account deactivated.",
            "id": str(employee.id),
            "is_active": employee.is_active,
        })
