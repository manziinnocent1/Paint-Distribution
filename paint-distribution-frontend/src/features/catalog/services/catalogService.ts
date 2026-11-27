import api from "../../../lib/axios";

import type {
  Brand,
  BrandFilters,
  BrandFormValues,
  Category,
  CategoryFilters,
  CategoryFormValues,
  PaginatedResponse,
  Product,
  ProductFilters,
  ProductFormValues,
  ProductVariant,
  ProductVariantFormValues,
} from "../types/catalog.types";

const PRODUCTS_URL = "/catalog/products/";
const CATEGORIES_URL = "/catalog/categories/";
const BRANDS_URL = "/catalog/brands/";

const buildParams = (
  filters: ProductFilters | CategoryFilters | BrandFilters,
) => {
  const params: Record<string, string | number | boolean> = {};

  if (filters.page !== undefined) {
    params.page = filters.page;
  }

  if (filters.page_size !== undefined) {
    params.page_size = filters.page_size;
  }

  if (filters.search) {
    params.search = filters.search;
  }

  if (filters.ordering) {
    params.ordering = filters.ordering;
  }

  if (filters.is_active !== undefined && filters.is_active !== "") {
    params.is_active = filters.is_active;
  }

  if ("category" in filters && filters.category) {
    params.category = filters.category;
  }

  if ("brand" in filters && filters.brand) {
    params.brand = filters.brand;
  }

  return params;
};

export const catalogService = {
  // Products

  async getProducts(
    filters: ProductFilters,
  ): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>(
      PRODUCTS_URL,
      { params: buildParams(filters) },
    );

    return response.data;
  },

  async getProduct(id: string): Promise<Product> {
    const response = await api.get<Product>(
      `${PRODUCTS_URL}${id}/`,
    );

    return response.data;
  },

  async createProduct(
    payload: ProductFormValues,
  ): Promise<Product> {
    const response = await api.post<Product>(
      PRODUCTS_URL,
      payload,
    );

    return response.data;
  },

  async updateProduct(
    id: string,
    payload: Partial<ProductFormValues>,
  ): Promise<Product> {
    const response = await api.patch<Product>(
      `${PRODUCTS_URL}${id}/`,
      payload,
    );

    return response.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`${PRODUCTS_URL}${id}/`);
  },

  // Categories

  async getCategories(
    filters: CategoryFilters,
  ): Promise<PaginatedResponse<Category>> {
    const response = await api.get<PaginatedResponse<Category>>(
      CATEGORIES_URL,
      { params: buildParams(filters) },
    );

    return response.data;
  },

  async getAllCategories(): Promise<Category[]> {
    const response = await api.get<
      PaginatedResponse<Category> | Category[]
    >(CATEGORIES_URL, {
      params: { page_size: 1000 },
    });

    return Array.isArray(response.data)
      ? response.data
      : response.data.results;
  },

  async getCategory(id: string): Promise<Category> {
    const response = await api.get<Category>(
      `${CATEGORIES_URL}${id}/`,
    );

    return response.data;
  },

  async createCategory(
    payload: CategoryFormValues,
  ): Promise<Category> {
    const response = await api.post<Category>(
      CATEGORIES_URL,
      {
        ...payload,
        parent: payload.parent || null,
      },
    );

    return response.data;
  },

  async updateCategory(
    id: string,
    payload: Partial<CategoryFormValues>,
  ): Promise<Category> {
    const response = await api.patch<Category>(
      `${CATEGORIES_URL}${id}/`,
      {
        ...payload,
        ...(payload.parent !== undefined
          ? { parent: payload.parent || null }
          : {}),
      },
    );

    return response.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`${CATEGORIES_URL}${id}/`);
  },

  // Brands

  async getBrands(
    filters: BrandFilters,
  ): Promise<PaginatedResponse<Brand>> {
    const response = await api.get<PaginatedResponse<Brand>>(
      BRANDS_URL,
      { params: buildParams(filters) },
    );

    return response.data;
  },

  async getAllBrands(): Promise<Brand[]> {
    const response = await api.get<
      PaginatedResponse<Brand> | Brand[]
    >(BRANDS_URL, {
      params: { page_size: 1000 },
    });

    return Array.isArray(response.data)
      ? response.data
      : response.data.results;
  },

  async getBrand(id: string): Promise<Brand> {
    const response = await api.get<Brand>(
      `${BRANDS_URL}${id}/`,
    );

    return response.data;
  },

  async createBrand(
    payload: BrandFormValues,
  ): Promise<Brand> {
    const response = await api.post<Brand>(
      BRANDS_URL,
      {
        ...payload,
        website: payload.website || null,
      },
    );

    return response.data;
  },

  async updateBrand(
    id: string,
    payload: Partial<BrandFormValues>,
  ): Promise<Brand> {
    const response = await api.patch<Brand>(
      `${BRANDS_URL}${id}/`,
      payload,
    );

    return response.data;
  },

  async deleteBrand(id: string): Promise<void> {
    await api.delete(`${BRANDS_URL}${id}/`);
  },

  // Product variants

  async getProductVariants(
    productId: string,
  ): Promise<ProductVariant[]> {
    const response = await api.get<
      PaginatedResponse<ProductVariant> | ProductVariant[]
    >(`${PRODUCTS_URL}${productId}/variants/`);

    return Array.isArray(response.data)
      ? response.data
      : response.data.results;
  },

  async createProductVariant(
    productId: string,
    payload: ProductVariantFormValues,
  ): Promise<ProductVariant> {
    const response = await api.post<ProductVariant>(
      `${PRODUCTS_URL}${productId}/variants/`,
      payload,
    );

    return response.data;
  },

  async updateProductVariant(
    productId: string,
    variantId: string,
    payload: Partial<ProductVariantFormValues>,
  ): Promise<ProductVariant> {
    const response = await api.patch<ProductVariant>(
      `${PRODUCTS_URL}${productId}/variants/${variantId}/`,
      payload,
    );

    return response.data;
  },

  async deleteProductVariant(
    productId: string,
    variantId: string,
  ): Promise<void> {
    await api.delete(
      `${PRODUCTS_URL}${productId}/variants/${variantId}/`,
    );
  },
};

export default catalogService;