
import { useQuery } from "@tanstack/react-query";
import { colorService } from "../services/colorService";
import { COLOR_FAMILY_QUERY_KEYS, DEFAULT_PAGE_SIZE } from "../constants/color.constants";
import type { ColorFamilyFilters } from "../types/color.types";

export function useColorFamilies(filters: ColorFamilyFilters = {}) {
  return useQuery({
    queryKey: COLOR_FAMILY_QUERY_KEYS.list(filters),
    queryFn: () =>
      colorService.getColorFamilies({
        page: 1,
        page_size: DEFAULT_PAGE_SIZE,
        ...filters,
      }),
  });
}

export function useColorFamily(id: string) {
  return useQuery({
    queryKey: COLOR_FAMILY_QUERY_KEYS.detail(id),
    queryFn: () => colorService.getColorFamily(id),
    enabled: Boolean(id),
  });
}
