import { CalendarDays, Hash, Palette, Tag } from "lucide-react";

import type { Color } from "../types/color.types";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ColorPreview } from "./shared/ColorPreview";
import { ColorSwatch } from "./shared/ColorSwatch";

import { formatDate } from "../utils/color.utils";

interface ColorDetailsProps {
  color: Color;
}

export function ColorDetails({ color }: ColorDetailsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <ColorPreview hex={color.hex_code} name={color.name} className="h-fit" />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{color.name}</CardTitle>
          <Badge variant={color.is_active ? "default" : "secondary"}>
            {color.is_active ? "Active" : "Inactive"}
          </Badge>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Color code</p>
            <p className="mt-1 flex items-center gap-2 font-mono text-sm">
              <Hash className="h-4 w-4" />
              {color.code}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">HEX value</p>
            <p className="mt-1 flex items-center gap-2 font-mono text-sm">
              <ColorSwatch color={color.hex_code} size="sm" />
              {color.hex_code}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">RGB value</p>
            <p className="mt-1 text-sm">{color.rgb_value || "Not specified"}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Color family</p>
            <p className="mt-1 flex items-center gap-2 text-sm">
              <Palette className="h-4 w-4" />
              {color.family_name || "Unassigned"}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs text-muted-foreground">Description</p>
            <p className="mt-1 text-sm">
              {color.description || "No description available."}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Created on</p>
            <p className="mt-1 flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4" />
              {formatDate(color.created_at)}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Last updated</p>
            <p className="mt-1 flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4" />
              {formatDate(color.updated_at)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
