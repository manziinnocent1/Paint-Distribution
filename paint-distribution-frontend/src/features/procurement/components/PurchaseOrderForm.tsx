import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROCUREMENT_CURRENCY } from "../constants/procurement.constants";
import { useProcurementSuppliers } from "../hooks/useProcurement";
import type {
  ProcurementRequest,
  PurchaseOrderInput,
} from "../types/procurement.types";
import { formatProcurementCurrency } from "../utils/procurement.utils";

interface Props {
  approvedRequests?: ProcurementRequest[];
  initialRequest?: ProcurementRequest;
  isSubmitting?: boolean;
  onSubmit: (input: PurchaseOrderInput) => void;
}

type OrderItem = PurchaseOrderInput["items"][number];

const emptyItem: OrderItem = {
  productId: "",
  productName: "",
  sku: "",
  quantity: 1,
  unitPrice: 0,
};

export function PurchaseOrderForm({
  approvedRequests = [],
  initialRequest,
  isSubmitting,
  onSubmit,
}: Props) {
  const { data: suppliers = [] } = useProcurementSuppliers();
  const [requestId, setRequestId] = useState(initialRequest?.id ?? "");
  const [supplierId, setSupplierId] = useState(
    initialRequest?.supplierId ?? "",
  );
  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [tax, setTax] = useState(18);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<OrderItem[]>(
    initialRequest?.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: item.estimatedUnitPrice,
    })) ?? [{ ...emptyItem }],
  );

  const selectedSupplier = suppliers.find(
    (supplier) => supplier.id === supplierId,
  );

  const selectedRequest = approvedRequests.find(
    (request) => request.id === requestId,
  );

  useEffect(() => {
    if (!selectedRequest) return;

    setItems(
      selectedRequest.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.estimatedUnitPrice,
      })),
    );

    if (selectedRequest.supplierId) {
      setSupplierId(selectedRequest.supplierId);
    }
  }, [selectedRequest]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const taxAmount = subtotal * (tax / 100);

  const updateItem = (
    index: number,
    field: keyof OrderItem,
    value: string | number,
  ) => {
    setItems((current) =>
      current.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !supplierId ||
      !orderDate ||
      !expectedDeliveryDate ||
      items.some(
        (item) =>
          !item.productId ||
          !item.productName ||
          !item.sku ||
          item.quantity <= 0 ||
          item.unitPrice < 0,
      )
    ) {
      return;
    }

    onSubmit({
      procurementRequestId: requestId || undefined,
      supplierId,
      supplierName: selectedSupplier?.name ?? "",
      orderDate,
      expectedDeliveryDate,
      items,
      tax: taxAmount,
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {approvedRequests.length > 0 && (
        <div className="space-y-2">
          <Label>Approved procurement request</Label>
          <Select
            value={requestId || "none"}
            onValueChange={(value) =>
              setRequestId(value === "none" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose an approved request" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Create without a request</SelectItem>
              {approvedRequests.map((request) => (
                <SelectItem key={request.id} value={request.id}>
                  {request.requestNumber} — {request.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Supplier *</Label>
          <Select value={supplierId} onValueChange={setSupplierId}>
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Order date *</Label>
          <Input
            type="date"
            value={orderDate}
            onChange={(event) => setOrderDate(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Expected delivery date *</Label>
          <Input
            type="date"
            value={expectedDeliveryDate}
            onChange={(event) => setExpectedDeliveryDate(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Tax rate (%)</Label>
          <Input
            type="number"
            min="0"
            value={tax}
            onChange={(event) => setTax(Number(event.target.value))}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Order items</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setItems((current) => [...current, { ...emptyItem }])
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add item
          </Button>
        </div>

        {items.map((item, index) => (
          <div
            key={index}
            className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div className="space-y-2">
              <Label>Product name</Label>
              <Input
                value={item.productName}
                onChange={(event) =>
                  updateItem(index, "productName", event.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Product ID</Label>
              <Input
                value={item.productId}
                onChange={(event) =>
                  updateItem(index, "productId", event.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>SKU</Label>
              <Input
                value={item.sku}
                onChange={(event) =>
                  updateItem(index, "sku", event.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(event) =>
                  updateItem(index, "quantity", Number(event.target.value))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Unit price ({PROCUREMENT_CURRENCY})</Label>
              <Input
                type="number"
                min="0"
                value={item.unitPrice}
                onChange={(event) =>
                  updateItem(index, "unitPrice", Number(event.target.value))
                }
              />
            </div>

            <div className="flex items-end justify-between">
              <p className="pb-2 text-sm font-medium">
                {formatProcurementCurrency(item.quantity * item.unitPrice)}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={items.length === 1}
                onClick={() =>
                  setItems((current) => current.filter((_, i) => i !== index))
                }
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Purchase order notes</Label>
        <Textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Delivery instructions or other notes..."
        />
      </div>

      <div className="rounded-lg bg-muted/50 p-4 text-right">
        <p className="text-sm text-muted-foreground">Subtotal</p>
        <p>{formatProcurementCurrency(subtotal)}</p>
        <p className="mt-2 text-sm text-muted-foreground">Tax</p>
        <p>{formatProcurementCurrency(taxAmount)}</p>
        <p className="mt-2 text-sm text-muted-foreground">Total</p>
        <p className="text-2xl font-bold">
          {formatProcurementCurrency(subtotal + taxAmount)}
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create purchase order"}
        </Button>
      </div>
    </form>
  );
}
