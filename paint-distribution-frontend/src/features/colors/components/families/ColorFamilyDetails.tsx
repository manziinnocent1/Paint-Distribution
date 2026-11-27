import { CalendarDays, Palette } from "lucide-react";

import type { ColorFamily, Color } from "../../types/color.types";

import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

import { ColorSwatch } from "../shared/ColorSwatch";
import { formatDate } from "../../utils/color.utils";

interface ColorFamilyDetailsProps {
  family: ColorFamily;
  colors?: Color[];
}

export function ColorFamilyDetails({
  family,
  colors = [],
}: ColorFamilyDetailsProps) {
  const familyColors = colors.filter((color) => color.family === family.id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{family.name}</CardTitle>
          <Badge variant={family.is_active ? "default" : "secondary"}>
            {family.is_active ? "Active" : "Inactive"}
          </Badge>
        </CardHeader>

        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Family code</p>
            <p className="mt-1 font-mono text-sm">{family.code}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Total colors</p>
            <p className="mt-1 flex items-center gap-2 font-semibold">
              <Palette className="h-4 w-4" />
              {familyColors.length || family.colors_count || 0}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs text-muted-foreground">Description</p>
            <p className="mt-1 text-sm">
              {family.description || "No description available."}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Created on</p>
            <p className="mt-1 flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4" />
              {formatDate(family.created_at)}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="font-semibold">Colors in this family</h3>

        {familyColors.length === 0 ? (
          <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
            No colors have been assigned to this family yet.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {familyColors.map((color) => (
              <div
                key={color.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <ColorSwatch color={color.hex_code} size="lg" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{color.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {color.hex_code}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
