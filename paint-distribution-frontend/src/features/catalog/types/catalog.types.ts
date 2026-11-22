export type ProductStatus = "active" | "inactive" | "draft";

export type ProductUnit =
  | "litre"
  | "ml"
  | "kg"
  | "gram"
  | "piece"
  | "set"
  | "other";

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  parent?: string | null;
  parent_name?: string | null;
  is_active: boolean;
  product_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  logo?: string | null;
  website?: string | null;
  is_active: boolean;
  product_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id?: string;
  image: string;
  alt_text?: string | null;
  is_primary?: boolean;
  display_order?: number;
}

export interface ProductAttributeValue {
  id?: string;
  value: string;
}

export interface ProductAttribute {
  id?: string;
  name: string;
  values: ProductAttributeValue[];
}

export interface ProductVariant {
  id: string;
  product?: string;
  name: string;
  sku: string;
  size?: number | null;
  unit?: ProductUnit | string | null;
  price: number;
  cost_price?: number | null;
  barcode?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  sku: string;
  description?: string | null;
  category: string;
  category_name?: string;
  brand: string | null;
  brand_name?: string | null;
  vendor?: string | null;
  vendor_name?: string | null;
  base_price: number;
  cost_price?: number | null;
  status: ProductStatus | string;
  is_active: boolean;
  is_perishable?: boolean;
  requires_refrigeration?: boolean;
  images: ProductImage[];
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  sku: string;
  category_name?: string;
  brand_name?: string | null;
  base_price: number;
  is_active: boolean;
  status?: string;
  primary_image?: string | null;
  variant_count?: number;
  created_at?: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  is_active?: boolean | "";
  ordering?: string;
  page: number;
  page_size: number;
}

export interface CategoryFilters {
  search?: string;
  is_active?: boolean | "";
  page: number;
  page_size: number;
}

export interface BrandFilters {
  search?: string;
  is_active?: boolean | "";
  page: number;
  page_size: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ProductFormValues {
  name: string;
  sku: string;
  description: string;
  category: string;
  brand: string;
  base_price: number;
  cost_price: number | null;
  is_active: boolean;
  is_perishable: boolean;
  requires_refrigeration: boolean;
}

export interface CategoryFormValues {
  name: string;
  description: string;
  parent: string;
  is_active: boolean;
}

export interface BrandFormValues {
  name: string;
  description: string;
  website: string;
  is_active: boolean;
}

export interface ProductVariantFormValues {
  name: string;
  sku: string;
  size: number | null;
  unit: ProductUnit | string;
  price: number;
  cost_price: number | null;
  barcode: string;
  is_active: boolean;
}

export interface CatalogSummary {
  total_products: number;
  active_products: number;
  inactive_products: number;
  total_categories: number;
  total_brands: number;
  total_variants: number;
}

export interface CatalogApiError {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}