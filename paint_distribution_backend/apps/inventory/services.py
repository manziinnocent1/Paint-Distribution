import uuid

from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import transaction

from apps.inventory.models import (
    Warehouse,
    StockLevel,
    StockMovement,
)


def get_or_create_stock_level(*, warehouse, product_variant):
    stock, _ = StockLevel.objects.get_or_create(
        warehouse=warehouse,
        product_variant=product_variant,
    )

    return stock


@transaction.atomic
def receive_stock(
    *,
    warehouse,
    product_variant,
    quantity,
    user,
    unit_cost=None,
    reference="",
    reason="",
):
    quantity = Decimal(str(quantity))

    if quantity <= 0:
        raise ValidationError("Received quantity must be positive.")

    warehouse = Warehouse.objects.select_for_update().get(
        pk=warehouse.pk,
    )

    if warehouse.status != Warehouse.Status.ACTIVE:
        raise ValidationError("Cannot receive stock into an inactive warehouse.")

    stock = get_or_create_stock_level(
        warehouse=warehouse,
        product_variant=product_variant,
    )

    stock = StockLevel.objects.select_for_update().get(pk=stock.pk)

    stock.quantity_on_hand += quantity
    stock.save(
        update_fields=["quantity_on_hand", "updated_at"],
    )

    return StockMovement.objects.create(
        movement_number=f"STK-{uuid.uuid4().hex[:12].upper()}",
        product_variant=product_variant,
        movement_type=StockMovement.MovementType.RECEIPT,
        to_warehouse=warehouse,
        quantity=quantity,
        unit_cost=unit_cost,
        reference=reference,
        reason=reason,
        performed_by=user,
    )


@transaction.atomic
def issue_stock(
    *,
    warehouse,
    product_variant,
    quantity,
    user,
    reference="",
    reason="",
):
    quantity = Decimal(str(quantity))

    if quantity <= 0:
        raise ValidationError("Issued quantity must be positive.")

    warehouse = Warehouse.objects.select_for_update().get(
        pk=warehouse.pk,
    )

    stock = StockLevel.objects.select_for_update().filter(
        warehouse=warehouse,
        product_variant=product_variant,
    ).first()

    if stock is None:
        raise ValidationError("No stock record exists for this product in this warehouse.")

    if stock.available_quantity < quantity:
        raise ValidationError(
            f"Insufficient available stock. Available: {stock.available_quantity}."
        )

    stock.quantity_on_hand -= quantity
    stock.save(
        update_fields=["quantity_on_hand", "updated_at"],
    )

    return StockMovement.objects.create(
        movement_number=f"STK-{uuid.uuid4().hex[:12].upper()}",
        product_variant=product_variant,
        movement_type=StockMovement.MovementType.ISSUE,
        from_warehouse=warehouse,
        quantity=quantity,
        reference=reference,
        reason=reason,
        performed_by=user,
    )


@transaction.atomic
def transfer_stock(
    *,
    source_warehouse,
    destination_warehouse,
    product_variant,
    quantity,
    user,
    reference="",
    reason="",
):
    quantity = Decimal(str(quantity))

    if quantity <= 0:
        raise ValidationError("Transfer quantity must be positive.")

    if source_warehouse.pk == destination_warehouse.pk:
        raise ValidationError(
            "Source and destination warehouses must be different."
        )

    warehouse_ids = sorted([
        source_warehouse.pk,
        destination_warehouse.pk,
    ], key=str)

    locked_warehouses = {
        warehouse.pk: warehouse
        for warehouse in Warehouse.objects.select_for_update().filter(
            pk__in=warehouse_ids,
        ).order_by("pk")
    }

    source = locked_warehouses.get(source_warehouse.pk)
    destination = locked_warehouses.get(destination_warehouse.pk)

    if source is None or destination is None:
        raise ValidationError("Source or destination warehouse was not found.")

    if (
        source.status != Warehouse.Status.ACTIVE
        or destination.status != Warehouse.Status.ACTIVE
    ):
        raise ValidationError("Both warehouses must be active.")

    source_stock = StockLevel.objects.select_for_update().filter(
        warehouse=source,
        product_variant=product_variant,
    ).first()

    if source_stock is None:
        raise ValidationError("Source warehouse has no stock record for this product.")

    if source_stock.available_quantity < quantity:
        raise ValidationError(
            f"Insufficient available stock. Available: {source_stock.available_quantity}."
        )

    destination_stock = get_or_create_stock_level(
        warehouse=destination,
        product_variant=product_variant,
    )

    destination_stock = StockLevel.objects.select_for_update().get(
        pk=destination_stock.pk,
    )

    source_stock.quantity_on_hand -= quantity
    destination_stock.quantity_on_hand += quantity

    source_stock.save(
        update_fields=["quantity_on_hand", "updated_at"],
    )

    destination_stock.save(
        update_fields=["quantity_on_hand", "updated_at"],
    )

    return StockMovement.objects.create(
        movement_number=f"STK-{uuid.uuid4().hex[:12].upper()}",
        product_variant=product_variant,
        movement_type=StockMovement.MovementType.TRANSFER,
        from_warehouse=source,
        to_warehouse=destination,
        quantity=quantity,
        reference=reference,
        reason=reason,
        performed_by=user,
    )


@transaction.atomic
def reserve_stock(
    *,
    warehouse,
    product_variant,
    quantity,
):
    quantity = Decimal(str(quantity))

    if quantity <= 0:
        raise ValidationError("Reservation quantity must be positive.")

    stock = StockLevel.objects.select_for_update().filter(
        warehouse=warehouse,
        product_variant=product_variant,
    ).first()

    if stock is None:
        raise ValidationError("No stock record exists for this product.")

    if stock.available_quantity < quantity:
        raise ValidationError("Insufficient available stock to reserve.")

    stock.quantity_reserved += quantity

    stock.save(
        update_fields=["quantity_reserved", "updated_at"],
    )

    return stock


@transaction.atomic
def release_reserved_stock(
    *,
    warehouse,
    product_variant,
    quantity,
):
    quantity = Decimal(str(quantity))

    if quantity <= 0:
        raise ValidationError("Release quantity must be positive.")

    stock = StockLevel.objects.select_for_update().filter(
        warehouse=warehouse,
        product_variant=product_variant,
    ).first()

    if stock is None or stock.quantity_reserved < quantity:
        raise ValidationError("The requested reserved quantity does not exist.")

    stock.quantity_reserved -= quantity

    stock.save(
        update_fields=["quantity_reserved", "updated_at"],
    )

    return stock


@transaction.atomic
def issue_reserved_stock(
    *,
    warehouse,
    product_variant,
    quantity,
    user,
    reference="",
    reason="",
):
    quantity = Decimal(str(quantity))

    if quantity <= 0:
        raise ValidationError("Issued quantity must be positive.")

    stock = StockLevel.objects.select_for_update().filter(
        warehouse=warehouse,
        product_variant=product_variant,
    ).first()

    if stock is None or stock.quantity_reserved < quantity:
        raise ValidationError("Insufficient reserved stock.")

    stock.quantity_reserved -= quantity
    stock.quantity_on_hand -= quantity

    stock.save(
        update_fields=[
            "quantity_reserved",
            "quantity_on_hand",
            "updated_at",
        ],
    )

    return StockMovement.objects.create(
        movement_number=f"STK-{uuid.uuid4().hex[:12].upper()}",
        product_variant=product_variant,
        movement_type=StockMovement.MovementType.ISSUE,
        from_warehouse=warehouse,
        quantity=quantity,
        reference=reference,
        reason=reason or "Fulfilled reserved stock.",
        performed_by=user,
    )