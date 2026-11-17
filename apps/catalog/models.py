import uuid

from django.conf import settings
from django.core.validators import (
    MinValueValidator,
    MaxValueValidator,
)
from django.db import models

from common.models import UUIDTimeStampedModel


class Category(UUIDTimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    name = models.CharField(
        max_length=120,
        unique=True,
    )

    slug = models.SlugField(
        max_length=140,
        unique=True,
    )

    description = models.TextField(
        blank=True,
    )

    parent = models.ForeignKey(
        "self",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="subcategories",
    )

    image = models.ImageField(
        upload_to="catalog/categories/",
        null=True,
        blank=True,
    )

    is_active = models.BooleanField(
        default=True,
        db_index=True,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    class Meta:
        db_table = "catalog_categories"
        ordering = ["display_order", "name"]
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Brand(UUIDTimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    name = models.CharField(
        max_length=120,
        unique=True,
    )

    slug = models.SlugField(
        max_length=140,
        unique=True,
    )

    description = models.TextField(
        blank=True,
    )

    logo = models.ImageField(
        upload_to="catalog/brands/",
        null=True,
        blank=True,
    )

    website = models.URLField(
        blank=True,
    )

    is_active = models.BooleanField(
        default=True,
        db_index=True,
    )

    class Meta:
        db_table = "catalog_brands"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Product(UUIDTimeStampedModel):
    class ProductType(models.TextChoices):
        PAINT = "PAINT", "Paint"
        PRIMER = "PRIMER", "Primer"
        COATING = "COATING", "Protective coating"
        THINNER = "THINNER", "Thinner"
        PUTTY = "PUTTY", "Putty and filler"
        ACCESSORY = "ACCESSORY", "Painting accessory"
        ADHESIVE = "ADHESIVE", "Adhesive"
        OTHER = "OTHER", "Other"

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        ACTIVE = "ACTIVE", "Active"
        INACTIVE = "INACTIVE", "Inactive"
        DISCONTINUED = "DISCONTINUED", "Discontinued"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    name = models.CharField(
        max_length=200,
        db_index=True,
    )

    slug = models.SlugField(
        max_length=220,
        unique=True,
    )

    product_code = models.CharField(
        max_length=60,
        unique=True,
        db_index=True,
    )

    description = models.TextField(
        blank=True,
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products",
    )

    brand = models.ForeignKey(
        Brand,
        on_delete=models.PROTECT,
        related_name="products",
        null=True,
        blank=True,
    )

    product_type = models.CharField(
        max_length=20,
        choices=ProductType.choices,
        default=ProductType.OTHER,
        db_index=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        db_index=True,
    )

    is_manufactured = models.BooleanField(
        default=False,
        help_text="Whether this product is manufactured or mixed by your business.",
    )

    is_distributed = models.BooleanField(
        default=True,
        help_text="Whether this product is distributed or resold.",
    )

    requires_colour_mixing = models.BooleanField(
        default=False,
    )

    technical_specifications = models.JSONField(
        default=dict,
        blank=True,
        help_text="Technical details such as coverage, drying time, and application method.",
    )

    safety_information = models.JSONField(
        default=dict,
        blank=True,
        help_text="Safety instructions and handling information.",
    )

    warranty_information = models.TextField(
        blank=True,
    )

    tax_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100),
        ],
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_catalog_products",
    )

    class Meta:
        db_table = "catalog_products"
        ordering = ["name"]
        indexes = [
            models.Index(
                fields=["product_type", "status"],
                name="cat_product_type_status_idx",
            ),
            models.Index(
                fields=["category", "status"],
                name="catalog_product_category_idx",
            ),
        ]

    def __str__(self):
        return f"{self.name} ({self.product_code})"


class ProductVariant(UUIDTimeStampedModel):
    class PaintFinish(models.TextChoices):
        MATTE = "MATTE", "Matte"
        EGGSHELL = "EGGSHELL", "Eggshell"
        SATIN = "SATIN", "Satin"
        SEMI_GLOSS = "SEMI_GLOSS", "Semi-gloss"
        GLOSS = "GLOSS", "Gloss"
        HIGH_GLOSS = "HIGH_GLOSS", "High-gloss"
        OTHER = "OTHER", "Other"

    class PaintBase(models.TextChoices):
        WHITE = "WHITE", "White base"
        PASTEL = "PASTEL", "Pastel base"
        MEDIUM = "MEDIUM", "Medium base"
        DEEP = "DEEP", "Deep base"
        CLEAR = "CLEAR", "Clear base"
        NOT_APPLICABLE = "N_A", "Not applicable"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="variants",
    )

    name = models.CharField(
        max_length=160,
        help_text="Example: White, 20 Litre or Deep Base, 5 Litre.",
    )

    sku = models.CharField(
        max_length=80,
        unique=True,
        db_index=True,
    )

    barcode = models.CharField(
        max_length=100,
        unique=True,
        null=True,
        blank=True,
    )

    volume_ml = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Container volume in millilitres. Example: 20000 for 20 litres.",
    )

    weight_grams = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    unit_of_measure = models.CharField(
        max_length=30,
        default="piece",
        help_text="Examples: piece, litre, kilogram, box.",
    )

    paint_finish = models.CharField(
        max_length=20,
        choices=PaintFinish.choices,
        default=PaintFinish.OTHER,
    )

    paint_base = models.CharField(
        max_length=20,
        choices=PaintBase.choices,
        default=PaintBase.NOT_APPLICABLE,
    )

    colour_name = models.CharField(
        max_length=100,
        blank=True,
    )

    colour_code = models.CharField(
        max_length=60,
        blank=True,
        help_text="Internal colour reference or colour-mixing code.",
    )

    hex_colour = models.CharField(
        max_length=7,
        blank=True,
        help_text="Hex colour, for example #FFFFFF.",
    )

    ral_code = models.CharField(
        max_length=30,
        blank=True,
        help_text="Optional RAL colour reference.",
    )

    cost_price = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
    )

    selling_price = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )

    wholesale_price = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
    )

    minimum_selling_price = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
    )

    is_active = models.BooleanField(
        default=True,
        db_index=True,
    )

    class Meta:
        db_table = "catalog_product_variants"
        ordering = ["product__name", "name"]
        indexes = [
            models.Index(
                fields=["product", "is_active"],
                name="catalog_variant_product_idx",
            ),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(cost_price__gte=0),
                name="catalog_variant_cost_nonnegative",
            ),
            models.CheckConstraint(
                condition=models.Q(selling_price__gte=0),
                name="catalog_variant_price_nonnegative",
            ),
        ]

    def __str__(self):
        return f"{self.product.name} - {self.name}"


class ProductImage(UUIDTimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images",
    )

    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.CASCADE,
        related_name="images",
        null=True,
        blank=True,
    )

    image = models.ImageField(
        upload_to="catalog/products/",
    )

    alt_text = models.CharField(
        max_length=200,
        blank=True,
    )

    is_primary = models.BooleanField(
        default=False,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    class Meta:
        db_table = "catalog_product_images"
        ordering = ["display_order", "created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["product"],
                condition=models.Q(is_primary=True, variant__isnull=True),
                name="catalog_one_primary_product_image",
            ),
        ]

    def __str__(self):
        return f"Image for {self.product.name}"


class ProductAttribute(UUIDTimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    name = models.CharField(
        max_length=100,
        unique=True,
    )

    description = models.TextField(
        blank=True,
    )

    is_filterable = models.BooleanField(
        default=True,
    )

    class Meta:
        db_table = "catalog_product_attributes"
        ordering = ["name"]

    def __str__(self):
        return self.name


class ProductAttributeValue(UUIDTimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="attribute_values",
    )

    attribute = models.ForeignKey(
        ProductAttribute,
        on_delete=models.PROTECT,
        related_name="values",
    )

    value = models.CharField(
        max_length=255,
    )

    class Meta:
        db_table = "catalog_product_attribute_values"
        constraints = [
            models.UniqueConstraint(
                fields=["product", "attribute"],
                name="catalog_unique_product_attribute",
            ),
        ]

    def __str__(self):
        return f"{self.product.name} - {self.attribute.name}: {self.value}"