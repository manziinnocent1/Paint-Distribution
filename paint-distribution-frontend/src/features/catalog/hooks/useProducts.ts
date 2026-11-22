import {
  useCallback,
  useEffect,
  useState,
} from "react";

import catalogService from "../services/catalogService";

import type {
  PaginatedResponse,
  Product,
  ProductFilters,
  ProductFormValues,
} from "../types/catalog.types";

export const useProducts = (filters: ProductFilters) => {
  const [data, setData] =
    useState<PaginatedResponse<Product> | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await catalogService.getProducts(filters);

      setData(result);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load products.",
      );
    } finally {
      setLoading(false);
    }
  }, [
    filters.search,
    filters.category,
    filters.brand,
    filters.is_active,
    filters.ordering,
    filters.page,
    filters.page_size,
  ]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (payload: ProductFormValues) => {
    const product = await catalogService.createProduct(payload);
    await fetchProducts();
    return product;
  };

  const updateProduct = async (
    id: string,
    payload: Partial<ProductFormValues>,
  ) => {
    const product = await catalogService.updateProduct(id, payload);
    await fetchProducts();
    return product;
  };

  const deleteProduct = async (id: string) => {
    await catalogService.deleteProduct(id);
    await fetchProducts();
  };

  return {
    data,
    products: data?.results ?? [],
    loading,
    error,
    refresh: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};