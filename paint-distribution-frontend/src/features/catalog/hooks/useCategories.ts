import {
  useCallback,
  useEffect,
  useState,
} from "react";

import catalogService from "../services/catalogService";

import type {
  Category,
  CategoryFilters,
  CategoryFormValues,
  PaginatedResponse,
} from "../types/catalog.types";

export const useCategories = (filters: CategoryFilters) => {
  const [data, setData] =
    useState<PaginatedResponse<Category> | null>(null);

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [result, allResult] = await Promise.all([
        catalogService.getCategories(filters),
        catalogService.getAllCategories(),
      ]);

      setData(result);
      setAllCategories(allResult);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load categories.",
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
    void fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (payload: CategoryFormValues) => {
    const category = await catalogService.createCategory(payload);
    await fetchCategories();
    return category;
  };

  const updateCategory = async (
    id: string,
    payload: Partial<CategoryFormValues>,
  ) => {
    const category = await catalogService.updateCategory(id, payload);
    await fetchCategories();
    return category;
  };

  const deleteCategory = async (id: string) => {
    await catalogService.deleteCategory(id);
    await fetchCategories();
  };

  return {
    data,
    categories: data?.results ?? [],
    allCategories,
    loading,
    error,
    refresh: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};