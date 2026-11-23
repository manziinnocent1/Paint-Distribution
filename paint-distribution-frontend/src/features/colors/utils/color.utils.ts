
import type {
  Color,
  ColorFormulaIngredient,
  FormulaUnit,
} from "../types/color.types";

export function normalizeHex(hex: string): string {
  let value = hex.trim();

  if (!value.startsWith("#")) {
    value = `#${value}`;
  }

  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    value = `#${value
      .slice(1)
      .split("")
      .map((character) => character + character)
      .join("")}`;
  }

  return value.toUpperCase();
}

export function isValidHex(hex: string): boolean {
  return /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

export function hexToRgb(hex: string): string {
  const normalized = normalizeHex(hex);

  if (!isValidHex(normalized)) {
    return "rgb(99, 102, 241)";
  }

  const value = normalized.substring(1);

  const red = parseInt(value.substring(0, 2), 16);
  const green = parseInt(value.substring(2, 4), 16);
  const blue = parseInt(value.substring(4, 6), 16);

  return `rgb(${red}, ${green}, ${blue})`;
}

export function rgbToHex(red: number, green: number, blue: number): string {
  const values = [red, green, blue];

  if (
    values.some(
      (value) => !Number.isInteger(value) || value < 0 || value > 255,
    )
  ) {
    throw new Error("RGB values must be integers between 0 and 255.");
  }

  return (
    "#" +
    values
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("")
  ).toUpperCase();
}

export function getContrastColor(hex: string): "#000000" | "#FFFFFF" {
  const rgb = hexToRgb(hex);
  const values = rgb.match(/\d+/g)?.map(Number);

  if (!values || values.length !== 3) {
    return "#000000";
  }

  const [red, green, blue] = values;

  const luminance =
    (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.55 ? "#000000" : "#FFFFFF";
}

export function getColorStatus(color: Color): "active" | "inactive" {
  return color.is_active ? "active" : "inactive";
}

export function calculateTotalQuantity(
  ingredients: ColorFormulaIngredient[],
): number {
  return ingredients.reduce(
    (total, ingredient) => total + ingredient.quantity,
    0,
  );
}

export function calculateIngredientPercentages(
  ingredients: ColorFormulaIngredient[],
): ColorFormulaIngredient[] {
  const total = calculateTotalQuantity(ingredients);

  if (total <= 0) return ingredients;

  return ingredients.map((ingredient) => ({
    ...ingredient,
    percentage: Number(((ingredient.quantity / total) * 100).toFixed(2)),
  }));
}

export function convertQuantity(
  quantity: number,
  from: FormulaUnit,
  to: FormulaUnit,
): number {
  const massUnits: Record<"g" | "kg", number> = {
    g: 1,
    kg: 1000,
  };

  const volumeUnits: Record<"ml" | "l", number> = {
    ml: 1,
    l: 1000,
  };

  if (from in massUnits && to in massUnits) {
    return (quantity * massUnits[from as "g" | "kg"]) /
      massUnits[to as "g" | "kg"];
  }

  if (from in volumeUnits && to in volumeUnits) {
    return (quantity * volumeUnits[from as "ml" | "l"]) /
      volumeUnits[to as "ml" | "l"];
  }

  throw new Error("Cannot convert between mass and volume units.");
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function generateColorCode(name: string): string {
  const slug = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `CLR-${slug}`;
}

export function generateFamilyCode(name: string): string {
  return `FAM-${name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

export function generateFormulaCode(name: string): string {
  return `FRM-${name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

export function filterColorsBySearch(
  colors: Color[],
  search: string,
): Color[] {
  const query = search.toLowerCase().trim();

  if (!query) return colors;

  return colors.filter((color) =>
    [
      color.name,
      color.code,
      color.hex_code,
      color.family_name ?? "",
    ].some((value) => value.toLowerCase().includes(query)),
  );
}
