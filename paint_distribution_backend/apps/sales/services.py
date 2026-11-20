import uuid
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from .models import Sale, SaleItem


def generate_sale_number():
    return f"SALE-{uuid.uuid4().hex[:12].upper()}"


@transaction.atomic
def create_sale(data, items, user):
    customer = data["customer"]

    if customer.status != customer.Status.ACTIVE:
        raise ValidationError("This customer is not active.")

    if not items:
        raise ValidationError("A sale must contain at least one item.")

    sale = Sale.objects.create(
        sale_number=generate_sale_number(),
        created_by=user,
        **data,
    )

    subtotal = Decimal("0")
    discount_total = Decimal("0")
    tax_total = Decimal("0")

    for item_data in items:
        variant = item_data["product_variant"]

        if not variant.is_active:
            raise ValidationError(
                f"Product variant {variant.sku} is inactive."
            )

        quantity = Decimal(str(item_data["quantity"]))
        unit_price = Decimal(str(item_data["unit_price"]))
        discount = Decimal(str(item_data.get("discount_amount", 0)))
        tax_rate = Decimal(str(item_data.get("tax_rate", variant.product.tax_rate)))

        gross = quantity * unit_price

        if discount < 0 or discount > gross:
            raise ValidationError(
                f"Invalid discount for product {variant.sku}."
            )

        taxable_amount = gross - discount
        tax = taxable_amount * tax_rate / Decimal("100")
        line_total = taxable_amount + tax

        SaleItem.objects.create(
            sale=sale,
            product_variant=variant,
            product_name=variant.product.name,
            variant_name=variant.name,
            sku=variant.sku,
            quantity=quantity,
            unit_price=unit_price,
            discount_amount=discount,
            tax_rate=tax_rate,
            line_total=line_total,
        )

        subtotal += gross
        discount_total += discount
        tax_total += tax

    sale.subtotal = subtotal
    sale.discount_amount = discount_total
    sale.tax_amount = tax_total
    sale.total_amount = subtotal - discount_total + tax_total

    sale.save(update_fields=[
        "subtotal",
        "discount_amount",
        "tax_amount",
        "total_amount",
        "updated_at",
    ])

    return sale


@transaction.atomic
def confirm_sale(sale_id, user):
    sale = Sale.objects.select_for_update().get(pk=sale_id)

    if sale.status != Sale.Status.DRAFT:
        raise ValidationError("Only draft sales can be confirmed.")

    if not sale.items.exists():
        raise ValidationError("A sale must have at least one item.")

    sale.status = Sale.Status.CONFIRMED
    sale.confirmed_by = user
    sale.confirmed_at = timezone.now()

    sale.save(update_fields=[
        "status",
        "confirmed_by",
        "confirmed_at",
        "updated_at",
    ])

    return sale


@transaction.atomic
def fulfill_sale_item(sale_item_id, quantity, user):
    from apps.inventory.services import issue_stock

    item = SaleItem.objects.select_for_update().select_related(
        "sale",
        "product_variant",
    ).get(pk=sale_item_id)

    sale = item.sale

    if sale.status not in {
        Sale.Status.CONFIRMED,
        Sale.Status.PARTIALLY_FULFILLED,
    }:
        raise ValidationError("Only confirmed sales can be fulfilled.")

    quantity = Decimal(str(quantity))

    if quantity <= 0:
        raise ValidationError("Fulfillment quantity must be positive.")

    if quantity > item.quantity_outstanding:
        raise ValidationError("Fulfillment exceeds the outstanding quantity.")

    issue_stock(
        warehouse=sale.warehouse,
        product_variant=item.product_variant,
        quantity=quantity,
        performed_by=user,
        reference=sale.sale_number,
        reason="Stock issued to fulfill customer sale.",
    )

    item.quantity_fulfilled += quantity
    item.save(update_fields=["quantity_fulfilled"])

    all_items = list(sale.items.all())

    if all(x.quantity_fulfilled >= x.quantity for x in all_items):
        sale.status = Sale.Status.FULFILLED
    else:
        sale.status = Sale.Status.PARTIALLY_FULFILLED

    sale.save(update_fields=["status", "updated_at"])

    return item