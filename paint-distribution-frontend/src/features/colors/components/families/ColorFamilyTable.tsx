import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";

import type { ColorFamily } from "../../types/color.types";

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

interface ColorFamilyTableProps {
  families: ColorFamily[];
  onView: (family: ColorFamily) => void;
  onEdit: (family: ColorFamily) => void;
  onDelete: (family: ColorFamily) => void;
}

export function ColorFamilyTable({
  families,
  onView,
  onEdit,
  onDelete,
}: ColorFamilyTableProps) {
  if (families.length === 0) {
    return (
      <div className="rounded-lg border p-10 text-center">
        <h3 className="font-semibold">No color families found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a family to start organizing your colors.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Family</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Colors</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {families.map((family) => (
            <TableRow key={family.id}>
              <TableCell className="font-medium">{family.name}</TableCell>

              <TableCell className="font-mono text-xs">{family.code}</TableCell>

              <TableCell className="max-w-xs truncate text-muted-foreground">
                {family.description || "No description"}
              </TableCell>

              <TableCell>{family.colors_count ?? 0}</TableCell>

              <TableCell>
                <Badge variant={family.is_active ? "default" : "secondary"}>
                  {family.is_active ? "Active" : "Inactive"}
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
                    <DropdownMenuItem onClick={() => onView(family)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => onEdit(family)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(family)}
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
