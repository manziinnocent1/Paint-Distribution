import { Plus, Trash2 } from "lucide-react";

import type {
  ColorFormulaIngredient,
  FormulaUnit,
} from "../../types/color.types";

import { FORMULA_UNIT_OPTIONS } from "../../constants/color.constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ColorSelector } from "../shared/ColorSelector";
import { calculateTotalQuantity } from "../../utils/color.utils";

interface FormulaIngredientEditorProps {
  ingredients: ColorFormulaIngredient[];
  onChange: (ingredients: ColorFormulaIngredient[]) => void;
}

const createIngredient = (): ColorFormulaIngredient => ({
  color: "",
  quantity: 0,
  unit: "ml",
});

export function FormulaIngredientEditor({
  ingredients,
  onChange,
}: FormulaIngredientEditorProps) {
  const updateIngredient = (
    index: number,
    updates: Partial<ColorFormulaIngredient>,
  ) => {
    onChange(
      ingredients.map((ingredient, currentIndex) =>
        currentIndex === index ? { ...ingredient, ...updates } : ingredient,
      ),
    );
  };

  const removeIngredient = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index));
  };

  const addIngredient = () => {
    onChange([...ingredients, createIngredient()]);
  };

  const total = calculateTotalQuantity(ingredients);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Formula ingredients</h3>
          <p className="text-xs text-muted-foreground">
            Add the base colors and their required quantities.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addIngredient}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add ingredient
        </Button>
      </div>

      {ingredients.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">No ingredients added.</p>
          <Button type="button" variant="link" onClick={addIngredient}>
            Add your first ingredient
          </Button>
        </div>
      )}

      {ingredients.map((ingredient, index) => (
        <div
          key={index}
          className="grid gap-3 rounded-lg border p-4 sm:grid-cols-[1fr_120px_110px_auto] sm:items-end"
        >
          <div className="space-y-2">
            <Label>Base color {index + 1}</Label>
            <ColorSelector
              value={ingredient.color}
              onChange={(value) => updateIngredient(index, { color: value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={ingredient.quantity || ""}
              onChange={(event) =>
                updateIngredient(index, {
                  quantity: Math.max(0, Number(event.target.value)),
                })
              }
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label>Unit</Label>
            <Select
              value={ingredient.unit}
              onValueChange={(value) =>
                updateIngredient(index, {
                  unit: value as FormulaUnit,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMULA_UNIT_OPTIONS.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => removeIngredient(index)}
            aria-label="Remove ingredient"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {ingredients.length > 0 && (
        <div className="flex justify-between rounded-lg bg-muted p-3 text-sm">
          <span className="text-muted-foreground">
            Total quantity (raw sum)
          </span>
          <span className="font-semibold">{total.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}
