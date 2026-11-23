import { Link } from "react-router-dom";
import { Pencil, Printer, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Sale } from "../types/sales.types";
import { canCancelSale, canEditSale } from "../utils/sales.utils";

type Props = {
  sale: Sale;
  onCancel: () => void;
  onDelete: () => void;
};

export function SalesActions({ sale, onCancel, onDelete }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {canEditSale(sale) && (
        <Button asChild variant="outline">
          <Link to={`/sales/${sale.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      )}

      <Button variant="outline" onClick={() => window.print()}>
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>

      {canCancelSale(sale) && (
        <Button variant="outline" onClick={onCancel}>
          <XCircle className="mr-2 h-4 w-4" />
          Cancel sale
        </Button>
      )}

      {["draft", "cancelled"].includes(sale.status) && (
        <Button variant="destructive" onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      )}
    </div>
  );
}
