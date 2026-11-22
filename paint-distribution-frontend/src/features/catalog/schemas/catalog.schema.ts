import type {
  BrandFormValues,
  CategoryFormValues,
  ProductFormValues,
  ProductVariantFormValues,
} from "../types/catalog.types";

export type ValidationErrors = Record<string, string>;

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

export const validateProduct = (
  values: ProductFormValues,
): ValidationResult => {
  const errors: ValidationErrors = {};

  if (!values.name.trim()) {
    errors.name = "Product name is required.";
  }

  if (!values.sku.trim()) {
    errors.sku = "Product SKU is required.";
  }

  if (!values.category) {
    errors.category = "Please select a product category.";
  }

  if (!Number.isFinite(values.base_price) || values.base_price < 0) {
    errors.base_price = "Enter a valid non-negative selling price.";
  }

  if (
    values.cost_price !== null &&
    (!Number.isFinite(values.cost_price) || values.cost_price < 0)
  ) {
    errors.cost_price = "Enter a valid non-negative cost price.";
  }

  if (
    values.cost_price !== null &&
    values.cost_price > values.base_price
  ) {
    errors.cost_price =
      "Cost price should not exceed the selling price.";
  }

  if (
    values.requires_refrigeration &&
    !values.is_perishable
  ) {
    errors.requires_refrigeration =
      "Refrigeration is only applicable to perishable products.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCategory = (
  values: CategoryFormValues,
): ValidationResult => {
  const errors: ValidationErrors = {};

  if (!values.name.trim()) {
    errors.name = "Category name is required.";
  }

  if (values.name.trim().length > 100) {
    errors.name = "Category name cannot exceed 100 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateBrand = (
  values: BrandFormValues,
): ValidationResult => {
  const errors: ValidationErrors = {};

  if (!values.name.trim()) {
    errors.name = "Brand name is required.";
  }

  if (
    values.website.trim() &&
    !/^https?:\/\/.+\..+/.test(values.website.trim())
  ) {
    errors.website = "Enter a valid website URL.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateProductVariant = (
  values: ProductVariantFormValues,
): ValidationResult => {
  const errors: ValidationErrors = {};

  if (!values.name.trim()) {
    errors.name = "Variant name is required.";
  }

  if (!values.sku.trim()) {
    errors.sku = "Variant SKU is required.";
  }

  if (
    values.size !== null &&
    (!Number.isFinite(values.size) || values.size <= 0)
  ) {
    errors.size = "Variant size must be greater than zero.";
  }

  if (!Number.isFinite(values.price) || values.price < 0) {
    errors.price = "Enter a valid non-negative price.";
  }

  if (
    values.cost_price !== null &&
    (!Number.isFinite(values.cost_price) || values.cost_price < 0)
  ) {
    errors.cost_price = "Enter a valid non-negative cost price.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};