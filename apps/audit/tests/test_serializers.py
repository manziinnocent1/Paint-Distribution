
from datetime import datetime, timezone
from types import SimpleNamespace
from uuid import uuid4

from rest_framework.test import APISimpleTestCase

from apps.audit.serializers import AuditLogSerializer


class AuditLogSerializerTests(APISimpleTestCase):
    def setUp(self):
        self.actor_id = uuid4()
        self.audit_log_id = uuid4()
        self.content_type_id = 1

        self.actor = SimpleNamespace(
            id=self.actor_id,
            email="admin@example.com",
        )

        self.content_type = SimpleNamespace(
            id=self.content_type_id,
            model="customer",
        )

        self.created_at = datetime(
            2026, 11, 17, 10, 30, 0,
            tzinfo=timezone.utc,
        )

        self.audit_log = SimpleNamespace(
            id=self.audit_log_id,
            actor=self.actor,
            action="CREATE",
            description="Created a new customer.",
            content_type=self.content_type,
            object_id="customer-123",
            object_repr="Customer: Example Company",
            changes={
                "name": {
                    "old": None,
                    "new": "Example Company",
                }
            },
            metadata={
                "source": "admin_panel",
            },
            ip_address="192.168.1.10",
            user_agent="Mozilla/5.0",
            created_at=self.created_at,
            get_action_display=lambda: "Create",
        )

    def test_serializer_returns_expected_fields(self):
        serializer = AuditLogSerializer(self.audit_log)

        expected_fields = {
            "id",
            "actor",
            "actor_email",
            "action",
            "action_display",
            "description",
            "content_type",
            "content_type_name",
            "object_id",
            "object_repr",
            "changes",
            "metadata",
            "ip_address",
            "user_agent",
            "created_at",
        }

        self.assertEqual(set(serializer.data.keys()), expected_fields)

    def test_serializer_returns_correct_actor_email(self):
        serializer = AuditLogSerializer(self.audit_log)

        self.assertEqual(
            serializer.data["actor_email"],
            "admin@example.com",
        )

    def test_serializer_returns_correct_action_display(self):
        serializer = AuditLogSerializer(self.audit_log)

        self.assertEqual(
            serializer.data["action_display"],
            "Create",
        )

    def test_serializer_returns_content_type_name(self):
        serializer = AuditLogSerializer(self.audit_log)

        self.assertEqual(
            serializer.data["content_type_name"],
            "customer",
        )

    def test_content_type_name_is_none_when_content_type_is_missing(self):
        self.audit_log.content_type = None

        serializer = AuditLogSerializer(self.audit_log)

        self.assertIsNone(
            serializer.data["content_type_name"]
        )

    def test_actor_email_is_none_when_actor_is_missing(self):
        self.audit_log.actor = None

        serializer = AuditLogSerializer(self.audit_log)

        self.assertIsNone(
            serializer.data["actor_email"]
        )

    def test_serializer_returns_correct_audit_log_details(self):
        serializer = AuditLogSerializer(self.audit_log)
        data = serializer.data

        self.assertEqual(
            data["description"],
            "Created a new customer.",
        )

        self.assertEqual(
            data["object_id"],
            "customer-123",
        )

        self.assertEqual(
            data["object_repr"],
            "Customer: Example Company",
        )

        self.assertEqual(
            data["ip_address"],
            "192.168.1.10",
        )

        self.assertEqual(
            data["user_agent"],
            "Mozilla/5.0",
        )

    def test_serializer_returns_changes_and_metadata(self):
        serializer = AuditLogSerializer(self.audit_log)
        data = serializer.data

        self.assertEqual(
            data["changes"],
            {
                "name": {
                    "old": None,
                    "new": "Example Company",
                }
            },
        )

        self.assertEqual(
            data["metadata"],
            {
                "source": "admin_panel",
            },
        )

    def test_all_serializer_fields_are_read_only(self):
        serializer = AuditLogSerializer()

        for field_name, field in serializer.fields.items():
            with self.subTest(field=field_name):
                self.assertTrue(
                    field.read_only,
                    f"{field_name} should be read-only.",
                )

    def test_serializer_does_not_accept_writable_input_fields(self):
        serializer = AuditLogSerializer(
            data={
                "description": "Attempt to modify audit log",
                "action": "DELETE",
                "metadata": {"source": "external"},
            }
        )

        self.assertTrue(serializer.is_valid())

        self.assertEqual(
            serializer.validated_data,
            {},
        )
