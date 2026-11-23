import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";

import type { Color } from "../types/color.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ColorSwatch } from "./shared/ColorSwatch";

interface ColorCardProps {
  color: Color;
  onView: (color: Color) => void;
  onEdit: (color: Color) => void;
  onDelete: (color: Color) => void;
}

export function ColorCard({ color, onView, onEdit, onDelete }: ColorCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
      <button
        type="button"
        className="block h-32 w-full cursor-pointer text-left"
        style={{ backgroundColor: color.hex_code }}
        onClick={() => onView(color)}
        aria-label={`View ${color.name}`}
      />

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{color.name}</h3>
            <p className="font-mono text-xs text-muted-foreground">
              {color.code}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(color)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(color)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(color)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between gap-2">
          <ColorSwatch color={color.hex_code} size="sm" showCode />
          <Badge variant={color.is_active ? "default" : "secondary"}>
            {color.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>

        {color.family_name && (
          <p className="text-xs text-muted-foreground">
            Family: {color.family_name}
          </p>
        )}
      </div>
    </div>
  );
}
