
/* ============================================================
   COLOR TYPES
============================================================ */

export type ColorStatus = "active" | "inactive" | "archived";

export interface Color {
  id: string;
  name: string;
  code: string;
  hex_code: string;
  rgb_value: string | null;
  description: string | null;
  family: string | null;
  family_name?: string | null;
  family_id?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateColorPayload {
  name: string;
  code: string;
  hex_code: string;
  rgb_value?: string;
  description?: string;
  family?: string | null;
  is_active?: boolean;
}

export type UpdateColorPayload = Partial<CreateColorPayload>;

/* ============================================================
   COLOR FAMILY TYPES
============================================================ */

export interface ColorFamily {
  id: string;
  name: string;
  code: string;
  description: string | null;
  colors_count?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateColorFamilyPayload {
  name: string;
  code: string;
  description?: string;
  is_active?: boolean;
}

export type UpdateColorFamilyPayload =
  Partial<CreateColorFamilyPayload>;

/* ============================================================
   COLOR FORMULA TYPES
============================================================ */

export type FormulaUnit = "ml" | "g" | "kg" | "l";

export interface ColorFormulaIngredient {
  id?: string;
  color: string;
  color_name?: string;
  color_code?: string;
  quantity: number;
  unit: FormulaUnit;
  percentage?: number;
}

export interface ColorFormula {
  id: string;
  name: string;
  code: string;
  description: string | null;
  target_color: string;
  target_color_name?: string;
  target_hex_code?: string;
  ingredients: ColorFormulaIngredient[];
  total_quantity?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateColorFormulaPayload {
  name: string;
  code: string;
  description?: string;
  target_color: string;
  ingredients: ColorFormulaIngredient[];
  is_active?: boolean;
}

export type UpdateColorFormulaPayload =
  Partial<CreateColorFormulaPayload>;

/* ============================================================
   FILTER TYPES
============================================================ */

export interface ColorFilters {
  search?: string;
  family?: string;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface ColorFamilyFilters {
  search?: string;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface ColorFormulaFilters {
  search?: string;
  target_color?: string;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

/* ============================================================
   API RESPONSE TYPES
============================================================ */

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail?: string;
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/* ============================================================
   FORM TYPES
============================================================ */

export interface ColorFormValues {
  name: string;
  code: string;
  hex_code: string;
  rgb_value: string;
  description: string;
  family: string;
  is_active: boolean;
}

export interface ColorFamilyFormValues {
  name: string;
  code: string;
  description: string;
  is_active: boolean;
}

export interface ColorFormulaFormValues {
  name: string;
  code: string;
  description: string;
  target_color: string;
  ingredients: ColorFormulaIngredient[];
  is_active: boolean;
}

/* ============================================================
   SHARED TYPES
============================================================ */

export interface SelectOption {
  label: string;
  value: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface SortState {
  field: string;
  direction: "asc" | "desc";
}
