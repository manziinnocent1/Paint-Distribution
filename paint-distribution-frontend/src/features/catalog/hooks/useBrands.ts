import {
  useCallback,
  useEffect,
  useState,
} from "react";

import catalogService from "../services/catalogService";

import type {
  Brand,
  BrandFilters,
  BrandFormValues,
  PaginatedResponse,
} from "../types/catalog.types";

export const useBrands = (filters: BrandFilters) => {
  const [data, setData] =
    useState<PaginatedResponse<Brand> | null>(null);

  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [result, allResult] = await Promise.all([
        catalogService.getBrands(filters),
        catalogService.getAllBrands(),
      ]);

      setData(result);
      setAllBrands(allResult);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load brands.",
      );
    } finally {
      setLoading(false);
    }
  }, [
    filters.search,
    filters.is_active,
    filters.page,
    filters.page_size,
  ]);

  useEffect(() => {
    void fetchBrands();
  }, [fetchBrands]);

  const createBrand = async (payload: BrandFormValues) => {
    const brand = await catalogService.createBrand(payload);
    await fetchBrands();
    return brand;
  };

  const updateBrand = async (
    id: string,
    payload: Partial<BrandFormValues>,
  ) => {
    const brand = await catalogService.updateBrand(id, payload);
    await fetchBrands();
    return brand;
  };

  const deleteBrand = async (id: string) => {
    await catalogService.deleteBrand(id);
    await fetchBrands();
  };

  return {
    data,
    brands: data?.results ?? [],
    allBrands,
    loading,
    error,
    refresh: fetchBrands,
    createBrand,
    updateBrand,
    deleteBrand,
  };
};