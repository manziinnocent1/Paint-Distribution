import uuid
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from .models import (
    PurchaseOrder,
    PurchaseOrderItem,
    GoodsReceipt,
    GoodsReceiptItem,
)


def generate_number(prefix):
    return f"{prefix}-{uuid.uuid4().hex[:12].upper()}"


@transaction.atomic
def create_purchase_order(data, items, user):
    supplier = data["supplier"]

    if supplier.status != supplier.Status.ACTIVE:
        raise ValidationError("The selected supplier is not active.")

    order = PurchaseOrder.objects.create(
        purchase_order_number=generate_number("PO"),
        created_by=user,
        **data,
    )

    subtotal = Decimal("0")
    tax_total = Decimal("0")

    for item_data in items:
        item = PurchaseOrderItem.objects.create(
            purchase_order=order,
            **item_data,
        )

        line_subtotal = item.quantity_ordered * item.unit_cost
        line_tax = line_subtotal * item.tax_rate / Decimal("100")

        item.line_total = line_subtotal + line_tax
        item.save(update_fields=["line_total"])

        subtotal += line_subtotal
        tax_total += line_tax

    order.subtotal = subtotal
    order.tax_amount = tax_total
    order.total_amount = subtotal + tax_total
    order.save(update_fields=[
        "subtotal",
        "tax_amount",
        "total_amount",
        "updated_at",
    ])

    return order


@transaction.atomic
def approve_purchase_order(order_id, user):
    order = PurchaseOrder.objects.select_for_update().get(pk=order_id)

    if order.status != PurchaseOrder.Status.SUBMITTED:
        raise ValidationError(
            "Only submitted purchase orders can be approved."
        )

    if not order.items.exists():
        raise ValidationError("A purchase order must contain at least one item.")

    order.status = PurchaseOrder.Status.APPROVED
    order.approved_by = user
    order.approved_at = timezone.now()
    order.save(update_fields=[
        "status",
        "approved_by",
        "approved_at",
        "updated_at",
    ])

    return order


@transaction.atomic
def receive_purchase_order(
    order_id,
    receipt_items,
    user,
    received_date,
    supplier_delivery_note="",
    notes="",
):
    from apps.inventory.services import receive_stock

    order = PurchaseOrder.objects.select_for_update().get(pk=order_id)

    if order.status not in {
        PurchaseOrder.Status.APPROVED,
        PurchaseOrder.Status.PARTIALLY_RECEIVED,
    }:
        raise ValidationError(
            "Only approved or partially received orders can receive goods."
        )

    if not receipt_items:
        raise ValidationError("At least one receipt item is required.")

    receipt = GoodsReceipt.objects.create(
        receipt_number=generate_number("GRN"),
        purchase_order=order,
        received_date=received_date,
        supplier_delivery_note=supplier_delivery_note,
        received_by=user,
        notes=notes,
    )

    for data in receipt_items:
        item = PurchaseOrderItem.objects.select_for_update().get(
            pk=data["purchase_order_item"].pk,
            purchase_order=order,
        )

        received_quantity = Decimal(str(data["quantity_received"]))
        rejected_quantity = Decimal(str(data.get("quantity_rejected", 0)))

        if received_quantity <= 0:
            raise ValidationError("Received quantity must be positive.")

        if rejected_quantity < 0 or rejected_quantity > received_quantity:
            raise ValidationError("Invalid rejected quantity.")

        accepted_quantity = received_quantity - rejected_quantity

        if received_quantity > item.quantity_outstanding:
            raise ValidationError(
                f"Received quantity exceeds outstanding quantity for {item.product_variant.sku}."
            )

        GoodsReceiptItem.objects.create(
            goods_receipt=receipt,
            purchase_order_item=item,
            quantity_received=received_quantity,
            quantity_rejected=rejected_quantity,
            rejection_reason=data.get("rejection_reason", ""),
        )

        if accepted_quantity > 0:
            receive_stock(
                warehouse=order.warehouse,
                product_variant=item.product_variant,
                quantity=accepted_quantity,
                performed_by=user,
                unit_cost=item.unit_cost,
                reference=receipt.receipt_number,
                reason="Goods received against purchase order.",
            )

        item.quantity_received += received_quantity
        item.save(update_fields=["quantity_received"])

    all_items = list(order.items.all())

    if all(item.quantity_received >= item.quantity_ordered for item in all_items):
        order.status = PurchaseOrder.Status.RECEIVED
    else:
        order.status = PurchaseOrder.Status.PARTIALLY_RECEIVED

    order.save(update_fields=["status", "updated_at"])

    receipt.status = GoodsReceipt.Status.CONFIRMED
    receipt.confirmed_at = timezone.now()
    receipt.save(update_fields=["status", "confirmed_at"])

    return receipt