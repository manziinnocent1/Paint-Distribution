
from decimal import Decimal

from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .models import Price, Discount


def get_product_price(
    product_variant_id,
    quantity=Decimal("1"),
    customer=None,
    price_type=Price.PriceType.RETAIL,
    currency="RWF",
):
    now = timezone.now()

    if quantity <= 0:
        raise ValidationError({"quantity": "Quantity must be greater than zero."})

    base_filters = {
        "product_variant_id": product_variant_id,
        "currency": currency,
        "status": Price.Status.ACTIVE,
        "effective_from__lte": now,
    }

    from django.db.models import Q

    active_dates = Q(effective_until__isnull=True) | Q(
        effective_until__gt=now
    )

    customer_price = None

    if customer:
        customer_price = (
            Price.objects.filter(
                **base_filters,
                customer=customer,
                price_type=Price.PriceType.CUSTOMER,
                minimum_quantity__lte=quantity,
            )
            .filter(active_dates)
            .order_by("-effective_from")
            .first()
        )

    if customer_price:
        return customer_price

    price = (
        Price.objects.filter(
            **base_filters,
            customer__isnull=True,
            price_type=price_type,
            minimum_quantity__lte=quantity,
        )
        .filter(active_dates)
        .order_by("-minimum_quantity", "-effective_from")
        .first()
    )

    if not price:
        raise ValidationError({
            "price": "No active price was found for this product variant."
        })

    return price


def calculate_discount(
    amount,
    discount_code,
    customer=None,
    product_variant_id=None,
):
    now = timezone.now()

    discount = Discount.objects.filter(
        code__iexact=discount_code,
        status=Discount.Status.ACTIVE,
        starts_at__lte=now,
    ).filter(
        Q(ends_at__isnull=True) | Q(ends_at__gt=now)
    ).first()

    if not discount:
        raise ValidationError({"discount_code": "Invalid or inactive discount."})

    if discount.customer_id and (
        not customer or discount.customer_id != customer.id
    ):
        raise ValidationError({"discount_code": "This discount is not available to this customer."})

    if discount.product_variant_id and (
        str(discount.product_variant_id) != str(product_variant_id)
    ):
        raise ValidationError({"discount_code": "This discount does not apply to this product."})

    if amount < discount.minimum_order_amount:
        raise ValidationError({"amount": "The minimum order amount has not been met."})

    if discount.discount_type == Discount.DiscountType.PERCENTAGE:
        discount_amount = amount * discount.value / Decimal("100")
    else:
        discount_amount = discount.value

    return min(discount_amount, amount)
