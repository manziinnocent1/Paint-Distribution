
import { useQuery } from "@tanstack/react-query";
import { colorService } from "../services/colorService";
import { COLOR_QUERY_KEYS, DEFAULT_PAGE_SIZE } from "../constants/color.constants";
import type { ColorFilters } from "../types/color.types";

export function useColors(filters: ColorFilters = {}) {
  return useQuery({
    queryKey: COLOR_QUERY_KEYS.list(filters),
    queryFn: () =>
      colorService.getColors({
        page: 1,
        page_size: DEFAULT_PAGE_SIZE,
        ...filters,
      }),
  });
}

export function useColor(id: string) {
  return useQuery({
    queryKey: COLOR_QUERY_KEYS.detail(id),
    queryFn: () => colorService.getColor(id),
    enabled: Boolean(id),
  });
}
