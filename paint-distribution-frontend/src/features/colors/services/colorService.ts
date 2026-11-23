
import type {
  Color,
  ColorFamily,
  ColorFormula,
  ColorFilters,
  ColorFamilyFilters,
  ColorFormulaFilters,
  CreateColorPayload,
  CreateColorFamilyPayload,
  CreateColorFormulaPayload,
  UpdateColorPayload,
  UpdateColorFamilyPayload,
  UpdateColorFormulaPayload,
  PaginatedResponse,
} from "../types/color.types";

import {
  calculateIngredientPercentages,
  calculateTotalQuantity,
} from "../utils/color.utils";

/* ============================================================
   MOCK DATA
============================================================ */

const now = new Date().toISOString();

let colors: Color[] = [
  {
    id: "color-1",
    name: "Pure White",
    code: "CLR-PURE-WHITE",
    hex_code: "#FFFFFF",
    rgb_value: "rgb(255, 255, 255)",
    description: "Standard pure white paint color.",
    family: "family-1",
    family_id: "family-1",
    family_name: "Whites",
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "color-2",
    name: "Ocean Blue",
    code: "CLR-OCEAN-BLUE",
    hex_code: "#0077B6",
    rgb_value: "rgb(0, 119, 182)",
    description: "Deep ocean-inspired blue.",
    family: "family-2",
    family_id: "family-2",
    family_name: "Blues",
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "color-3",
    name: "Forest Green",
    code: "CLR-FOREST-GREEN",
    hex_code: "#228B22",
    rgb_value: "rgb(34, 139, 34)",
    description: "Natural forest green.",
    family: "family-3",
    family_id: "family-3",
    family_name: "Greens",
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "color-4",
    name: "Sunset Red",
    code: "CLR-SUNSET-RED",
    hex_code: "#E63946",
    rgb_value: "rgb(230, 57, 70)",
    description: "Warm vibrant red.",
    family: "family-4",
    family_id: "family-4",
    family_name: "Reds",
    is_active: false,
    created_at: now,
    updated_at: now,
  },
];

let families: ColorFamily[] = [
  {
    id: "family-1",
    name: "Whites",
    code: "FAM-WHITES",
    description: "White and off-white shades.",
    colors_count: 1,
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "family-2",
    name: "Blues",
    code: "FAM-BLUES",
    description: "Blue color variations.",
    colors_count: 1,
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "family-3",
    name: "Greens",
    code: "FAM-GREENS",
    description: "Green color variations.",
    colors_count: 1,
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "family-4",
    name: "Reds",
    code: "FAM-REDS",
    description: "Red color variations.",
    colors_count: 1,
    is_active: true,
    created_at: now,
    updated_at: now,
  },
];

let formulas: ColorFormula[] = [];

/* ============================================================
   HELPERS
============================================================ */

const delay = (ms = 200) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 10,
): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;

  return {
    count: items.length,
    next: start + pageSize < items.length ? "next" : null,
    previous: page > 1 ? "previous" : null,
    results: items.slice(start, start + pageSize),
  };
}

function matchesSearch(item: object, search?: string): boolean {
  if (!search) return true;

  return Object.values(item).some(
    (value) =>
      typeof value === "string" &&
      value.toLowerCase().includes(search.toLowerCase()),
  );
}

function sortItems<T extends Record<string, unknown>>(
  items: T[],
  ordering?: string,
): T[] {
  if (!ordering) return items;

  const descending = ordering.startsWith("-");
  const field = descending ? ordering.slice(1) : ordering;

  return [...items].sort((a, b) => {
    const left = String(a[field] ?? "");
    const right = String(b[field] ?? "");

    return descending
      ? right.localeCompare(left)
      : left.localeCompare(right);
  });
}

/* ============================================================
   COLOR SERVICE
============================================================ */

export const colorService = {
  async getColors(
    filters: ColorFilters = {},
  ): Promise<PaginatedResponse<Color>> {
    await delay();

    let result = [...colors];

    result = result.filter((item) => matchesSearch(item, filters.search));

    if (filters.family) {
      result = result.filter((item) => item.family === filters.family);
    }

    if (filters.is_active !== undefined) {
      result = result.filter(
        (item) => item.is_active === filters.is_active,
      );
    }

    result = sortItems(result, filters.ordering);

    return paginate(result, filters.page, filters.page_size);
  },

  async getColor(id: string): Promise<Color> {
    await delay();

    const color = colors.find((item) => item.id === id);

    if (!color) throw new Error("Color not found.");

    return color;
  },

  async createColor(payload: CreateColorPayload): Promise<Color> {
    await delay();

    const color: Color = {
      ...payload,
      id: crypto.randomUUID(),
      rgb_value: payload.rgb_value ?? null,
      description: payload.description ?? null,
      family: payload.family ?? null,
      family_id: payload.family ?? null,
      family_name: families.find(
        (family) => family.id === payload.family,
      )?.name ?? null,
      is_active: payload.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    colors = [color, ...colors];

    return color;
  },

  async updateColor(
    id: string,
    payload: UpdateColorPayload,
  ): Promise<Color> {
    await delay();

    const index = colors.findIndex((item) => item.id === id);

    if (index === -1) throw new Error("Color not found.");

    const updated: Color = {
      ...colors[index],
      ...payload,
      family: payload.family ?? colors[index].family,
      family_id: payload.family ?? colors[index].family_id,
      family_name:
        families.find((family) => family.id === payload.family)?.name ??
        (payload.family === null
          ? null
          : colors[index].family_name),
      updated_at: new Date().toISOString(),
    };

    colors[index] = updated;

    return updated;
  },

  async deleteColor(id: string): Promise<void> {
    await delay();

    if (!colors.some((item) => item.id === id)) {
      throw new Error("Color not found.");
    }

    colors = colors.filter((item) => item.id !== id);
  },

  /* ==========================================================
     COLOR FAMILY SERVICE
  ========================================================== */

  async getColorFamilies(
    filters: ColorFamilyFilters = {},
  ): Promise<PaginatedResponse<ColorFamily>> {
    await delay();

    let result = [...families];

    result = result.filter((item) => matchesSearch(item, filters.search));

    if (filters.is_active !== undefined) {
      result = result.filter(
        (item) => item.is_active === filters.is_active,
      );
    }

    result = sortItems(result, filters.ordering);

    return paginate(result, filters.page, filters.page_size);
  },

  async getColorFamily(id: string): Promise<ColorFamily> {
    await delay();

    const family = families.find((item) => item.id === id);

    if (!family) throw new Error("Color family not found.");

    return family;
  },

  async createColorFamily(
    payload: CreateColorFamilyPayload,
  ): Promise<ColorFamily> {
    await delay();

    const family: ColorFamily = {
      ...payload,
      id: crypto.randomUUID(),
      description: payload.description ?? null,
      colors_count: 0,
      is_active: payload.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    families = [family, ...families];

    return family;
  },

  async updateColorFamily(
    id: string,
    payload: UpdateColorFamilyPayload,
  ): Promise<ColorFamily> {
    await delay();

    const index = families.findIndex((item) => item.id === id);

    if (index === -1) throw new Error("Color family not found.");

    families[index] = {
      ...families[index],
      ...payload,
      updated_at: new Date().toISOString(),
    };

    return families[index];
  },

  async deleteColorFamily(id: string): Promise<void> {
    await delay();

    if (colors.some((color) => color.family === id)) {
      throw new Error("Remove or reassign colors before deleting this family.");
    }

    if (!families.some((item) => item.id === id)) {
      throw new Error("Color family not found.");
    }

    families = families.filter((item) => item.id !== id);
  },

  /* ==========================================================
     COLOR FORMULA SERVICE
  ========================================================== */

  async getColorFormulas(
    filters: ColorFormulaFilters = {},
  ): Promise<PaginatedResponse<ColorFormula>> {
    await delay();

    let result = [...formulas];

    result = result.filter((item) => matchesSearch(item, filters.search));

    if (filters.target_color) {
      result = result.filter(
        (item) => item.target_color === filters.target_color,
      );
    }

    if (filters.is_active !== undefined) {
      result = result.filter(
        (item) => item.is_active === filters.is_active,
      );
    }

    result = sortItems(result, filters.ordering);

    return paginate(result, filters.page, filters.page_size);
  },

  async getColorFormula(id: string): Promise<ColorFormula> {
    await delay();

    const formula = formulas.find((item) => item.id === id);

    if (!formula) throw new Error("Color formula not found.");

    return formula;
  },

  async createColorFormula(
    payload: CreateColorFormulaPayload,
  ): Promise<ColorFormula> {
    await delay();

    const target = colors.find(
      (color) => color.id === payload.target_color,
    );

    const formula: ColorFormula = {
      ...payload,
      id: crypto.randomUUID(),
      description: payload.description ?? null,
      target_color_name: target?.name,
      target_hex_code: target?.hex_code,
      ingredients: calculateIngredientPercentages(payload.ingredients),
      total_quantity: calculateTotalQuantity(payload.ingredients),
      is_active: payload.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    formulas = [formula, ...formulas];

    return formula;
  },

  async updateColorFormula(
    id: string,
    payload: UpdateColorFormulaPayload,
  ): Promise<ColorFormula> {
    await delay();

    const index = formulas.findIndex((item) => item.id === id);

    if (index === -1) throw new Error("Color formula not found.");

    const existing = formulas[index];
    const targetId = payload.target_color ?? existing.target_color;
    const target = colors.find((color) => color.id === targetId);
    const ingredients = payload.ingredients ?? existing.ingredients;

    formulas[index] = {
      ...existing,
      ...payload,
      target_color_name: target?.name,
      target_hex_code: target?.hex_code,
      ingredients: calculateIngredientPercentages(ingredients),
      total_quantity: calculateTotalQuantity(ingredients),
      updated_at: new Date().toISOString(),
    };

    return formulas[index];
  },

  async deleteColorFormula(id: string): Promise<void> {
    await delay();

    if (!formulas.some((item) => item.id === id)) {
      throw new Error("Color formula not found.");
    }

    formulas = formulas.filter((item) => item.id !== id);
  },
};
