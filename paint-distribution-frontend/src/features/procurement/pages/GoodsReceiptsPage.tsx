import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGoodsReceipts } from "../hooks/useGoodsReceipts";
import { ProcurementStatusBadge } from "../components/ProcurementStatusBadge";

export function GoodsReceiptsPage() {
  const { data: receipts = [], isLoading, isError } = useGoodsReceipts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Goods receipts</h1>
          <p className="text-muted-foreground">
            Record deliveries and inspect received products.
          </p>
        </div>
        <Button asChild>
          <Link to="/procurement/goods-receipts/new">
            <Plus className="mr-2 h-4 w-4" />
            Record receipt
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-lg border p-10 text-center">
          Loading goods receipts...
        </div>
      ) : isError ? (
        <div className="rounded-lg border p-10 text-center text-destructive">
          Unable to load goods receipts.
        </div>
      ) : receipts.length === 0 ? (
        <div className="rounded-lg border p-10 text-center text-muted-foreground">
          No goods receipts have been recorded.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt number</TableHead>
                <TableHead>Purchase order</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Received date</TableHead>
                <TableHead>Received by</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-medium">
                    {receipt.receiptNumber}
                  </TableCell>
                  <TableCell>{receipt.purchaseOrderNumber}</TableCell>
                  <TableCell>{receipt.supplierName}</TableCell>
                  <TableCell>{receipt.receivedDate}</TableCell>
                  <TableCell>{receipt.receivedBy}</TableCell>
                  <TableCell>
                    <ProcurementStatusBadge status={receipt.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
