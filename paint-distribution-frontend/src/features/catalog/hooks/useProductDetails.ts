import {
  useCallback,
  useEffect,
  useState,
} from "react";

import catalogService from "../services/catalogService";

import type {
  Product,
  ProductFormValues,
} from "../types/catalog.types";

export const useProductDetails = (id?: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await catalogService.getProduct(id);

      setProduct(result);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load product details.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchProduct();
  }, [fetchProduct]);

  const updateProduct = async (
    payload: Partial<ProductFormValues>,
  ) => {
    if (!id) {
      throw new Error("A product ID is required.");
    }

    const updated = await catalogService.updateProduct(id, payload);

    setProduct(updated);

    return updated;
  };

  return {
    product,
    loading,
    error,
    refresh: fetchProduct,
    updateProduct,
  };
};