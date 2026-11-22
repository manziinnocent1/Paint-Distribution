import {
  useCallback,
  useEffect,
  useState,
} from "react";

import catalogService from "../services/catalogService";

import type {
  ProductVariant,
  ProductVariantFormValues,
} from "../types/catalog.types";

export const useProductVariants = (productId?: string) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(Boolean(productId));
  const [error, setError] = useState<string | null>(null);

  const fetchVariants = useCallback(async () => {
    if (!productId) {
      setVariants([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result =
        await catalogService.getProductVariants(productId);

      setVariants(result);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load product variants.",
      );
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void fetchVariants();
  }, [fetchVariants]);

  const createVariant = async (
    payload: ProductVariantFormValues,
  ) => {
    if (!productId) {
      throw new Error("A product ID is required.");
    }

    const result = await catalogService.createProductVariant(
      productId,
      payload,
    );

    await fetchVariants();

    return result;
  };

  const updateVariant = async (
    variantId: string,
    payload: Partial<ProductVariantFormValues>,
  ) => {
    if (!productId) {
      throw new Error("A product ID is required.");
    }

    const result = await catalogService.updateProductVariant(
      productId,
      variantId,
      payload,
    );

    await fetchVariants();

    return result;
  };

  const deleteVariant = async (variantId: string) => {
    if (!productId) {
      throw new Error("A product ID is required.");
    }

    await catalogService.deleteProductVariant(productId, variantId);

    await fetchVariants();
  };

  return {
    variants,
    loading,
    error,
    refresh: fetchVariants,
    createVariant,
    updateVariant,
    deleteVariant,
  };
};