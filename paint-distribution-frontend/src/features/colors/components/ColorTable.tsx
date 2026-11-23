import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import type { Color } from "../types/color.types";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ColorSwatch } from "./shared/ColorSwatch";

interface ColorTableProps {
  colors: Color[];
  onView: (color: Color) => void;
  onEdit: (color: Color) => void;
  onDelete: (color: Color) => void;
}

export function ColorTable({
  colors,
  onView,
  onEdit,
  onDelete,
}: ColorTableProps) {
  if (colors.length === 0) {
    return (
      <div className="rounded-lg border p-10 text-center">
        <h3 className="font-semibold">No colors found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try changing your filters or create a new color.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Color</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>HEX</TableHead>
            <TableHead>Family</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {colors.map((color) => (
            <TableRow key={color.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <ColorSwatch color={color.hex_code} size="md" />
                  <span className="font-medium">{color.name}</span>
                </div>
              </TableCell>

              <TableCell className="font-mono text-xs">{color.code}</TableCell>

              <TableCell className="font-mono text-xs">
                {color.hex_code}
              </TableCell>

              <TableCell>{color.family_name || "Unassigned"}</TableCell>

              <TableCell>
                <Badge variant={color.is_active ? "default" : "secondary"}>
                  {color.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
