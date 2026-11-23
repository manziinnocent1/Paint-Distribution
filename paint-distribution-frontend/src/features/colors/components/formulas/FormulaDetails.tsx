import { Calculator, CalendarDays, Layers } from "lucide-react";

import type { ColorFormula } from "../../types/color.types";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ColorSwatch } from "../shared/ColorSwatch";
import { formatDate } from "../../utils/color.utils";

interface FormulaDetailsProps {
  formula: ColorFormula;
}

export function FormulaDetails({ formula }: FormulaDetailsProps) {
  const total =
    formula.total_quantity ??
    formula.ingredients.reduce(
      (sum, ingredient) => sum + ingredient.quantity,
      0,
    );

  const unit = formula.ingredients[0]?.unit ?? "ml";
  const hasMixedUnits = formula.ingredients.some(
    (ingredient) => ingredient.unit !== unit,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{formula.name}</CardTitle>
          <Badge variant={formula.is_active ? "default" : "secondary"}>
            {formula.is_active ? "Active" : "Inactive"}
          </Badge>
        </CardHeader>

        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Formula code</p>
            <p className="mt-1 font-mono text-sm">{formula.code}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Target color</p>
            <div className="mt-2 flex items-center gap-2">
              {formula.target_hex_code && (
                <ColorSwatch color={formula.target_hex_code} />
              )}
              <span className="text-sm">
                {formula.target_color_name || formula.target_color}
              </span>
            </div>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs text-muted-foreground">Description</p>
            <p className="mt-1 text-sm">
              {formula.description || "No description available."}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Ingredients</p>
            <p className="mt-1 flex items-center gap-2 font-semibold">
              <Layers className="h-4 w-4" />
              {formula.ingredients.length}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Total quantity</p>
            <p className="mt-1 flex items-center gap-2 font-semibold">
              <Calculator className="h-4 w-4" />
              {total.toFixed(2)} {hasMixedUnits ? "(mixed units)" : unit}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Created on</p>
            <p className="mt-1 flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4" />
              {formatDate(formula.created_at)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Formula ingredients</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {formula.ingredients.map((ingredient, index) => (
            <div
              key={ingredient.id ?? `${ingredient.color}-${index}`}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                {ingredient.color_code && (
                  <ColorSwatch color={ingredient.color_code} />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {ingredient.color_name || ingredient.color}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {ingredient.color_code || "Base ingredient"}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold">
                  {ingredient.quantity} {ingredient.unit}
                </p>
                {ingredient.percentage !== undefined && (
                  <p className="text-xs text-muted-foreground">
                    {ingredient.percentage}%
                  </p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
