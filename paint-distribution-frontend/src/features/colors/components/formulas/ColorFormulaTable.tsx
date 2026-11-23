import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import type { ColorFormula } from "../../types/color.types";

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

import { ColorSwatch } from "../shared/ColorSwatch";

interface ColorFormulaTableProps {
  formulas: ColorFormula[];
  onView: (formula: ColorFormula) => void;
  onEdit: (formula: ColorFormula) => void;
  onDelete: (formula: ColorFormula) => void;
}

export function ColorFormulaTable({
  formulas,
  onView,
  onEdit,
  onDelete,
}: ColorFormulaTableProps) {
  if (formulas.length === 0) {
    return (
      <div className="rounded-lg border p-10 text-center">
        <h3 className="font-semibold">No formulas found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first paint formula.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Formula</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Target color</TableHead>
            <TableHead>Ingredients</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {formulas.map((formula) => (
            <TableRow key={formula.id}>
              <TableCell className="font-medium">{formula.name}</TableCell>

              <TableCell className="font-mono text-xs">
                {formula.code}
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  {formula.target_hex_code && (
                    <ColorSwatch color={formula.target_hex_code} size="sm" />
                  )}
                  <span>
                    {formula.target_color_name || formula.target_color}
                  </span>
                </div>
              </TableCell>

              <TableCell>{formula.ingredients.length}</TableCell>

              <TableCell>
                <Badge variant={formula.is_active ? "default" : "secondary"}>
                  {formula.is_active ? "Active" : "Inactive"}
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
                    <DropdownMenuItem onClick={() => onView(formula)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => onEdit(formula)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(formula)}
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
