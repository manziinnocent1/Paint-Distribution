
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Notification, NotificationPreference
from .permissions import IsActiveUser, IsNotificationOwner
from .serializers import (
    NotificationSerializer,
    NotificationPreferenceSerializer,
)


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsActiveUser, IsNotificationOwner]

    def get_queryset(self):
        return Notification.objects.filter(
            recipient=self.request.user
        ).select_related("recipient", "customer")

    @action(detail=False, methods=["get"])
    def unread(self, request):
        queryset = self.get_queryset().filter(is_read=False)
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        return Response(self.get_serializer(queryset, many=True).data)

    @action(detail=False, methods=["get"])
    def unread_count(self, request):
        count = self.get_queryset().filter(is_read=False).count()
        return Response({"unread_count": count})

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        notification = self.get_object()

        if not notification.is_read:
            notification.is_read = True
            notification.read_at = timezone.now()
            notification.save(update_fields=["is_read", "read_at"])

        return Response(self.get_serializer(notification).data)

    @action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        self.get_queryset().filter(is_read=False).update(
            is_read=True,
            read_at=timezone.now(),
        )
        return Response(
            {"message": "All notifications marked as read."},
            status=status.HTTP_200_OK,
        )


class NotificationPreferenceViewSet(viewsets.ViewSet):
    permission_classes = [IsActiveUser]

    def list(self, request):
        preferences, _ = NotificationPreference.objects.get_or_create(
            user=request.user
        )
        return Response(
            NotificationPreferenceSerializer(preferences).data
        )

    def partial_update(self, request, pk=None):
        preferences, _ = NotificationPreference.objects.get_or_create(
            user=request.user
        )

        serializer = NotificationPreferenceSerializer(
            preferences,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)
