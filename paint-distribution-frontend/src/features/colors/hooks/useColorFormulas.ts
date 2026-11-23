
import { useQuery } from "@tanstack/react-query";
import { colorService } from "../services/colorService";
import { COLOR_FORMULA_QUERY_KEYS, DEFAULT_PAGE_SIZE } from "../constants/color.constants";
import type { ColorFormulaFilters } from "../types/color.types";

export function useColorFormulas(filters: ColorFormulaFilters = {}) {
  return useQuery({
    queryKey: COLOR_FORMULA_QUERY_KEYS.list(filters),
    queryFn: () =>
      colorService.getColorFormulas({
        page: 1,
        page_size: DEFAULT_PAGE_SIZE,
        ...filters,
      }),
  });
}

export function useColorFormula(id: string) {
  return useQuery({
    queryKey: COLOR_FORMULA_QUERY_KEYS.detail(id),
    queryFn: () => colorService.getColorFormula(id),
    enabled: Boolean(id),
  });
}
