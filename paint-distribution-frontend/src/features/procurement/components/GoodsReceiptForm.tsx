import { useEffect, useState } from "react";
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
import { usePurchaseOrders } from "../hooks/usePurchaseOrders";
import type {
  GoodsReceiptInput,
  PurchaseOrder,
} from "../types/procurement.types";

interface Props {
  isSubmitting?: boolean;
  onSubmit: (input: GoodsReceiptInput) => void;
}

export function GoodsReceiptForm({ isSubmitting, onSubmit }: Props) {
  const { data: orders = [] } = usePurchaseOrders();
  const [orderId, setOrderId] = useState("");
  const [receivedDate, setReceivedDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<GoodsReceiptInput["items"]>([]);

  const selectedOrder = orders.find((order) => order.id === orderId);

  useEffect(() => {
    if (!selectedOrder) {
      setItems([]);
      return;
    }

    setItems(
      selectedOrder.items
        .filter((item) => item.quantity > item.receivedQuantity)
        .map((item) => ({
          purchaseOrderItemId: item.id,
          productName: item.productName,
          sku: item.sku,
          orderedQuantity: item.quantity - item.receivedQuantity,
          receivedQuantity: 0,
          acceptedQuantity: 0,
          rejectedQuantity: 0,
          notes: "",
        })),
    );
  }, [selectedOrder]);

  const updateItem = (
    index: number,
    field:
      | "receivedQuantity"
      | "acceptedQuantity"
      | "rejectedQuantity"
      | "notes",
    value: number | string,
  ) => {
    setItems((current) =>
      current.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!orderId || !receivedDate || !items.length) return;

    const invalid = items.some(
      (item) =>
        item.receivedQuantity < 0 ||
        item.acceptedQuantity < 0 ||
        item.rejectedQuantity < 0 ||
        item.receivedQuantity > item.orderedQuantity ||
        item.acceptedQuantity + item.rejectedQuantity > item.receivedQuantity,
    );

    if (invalid) return;

    onSubmit({
      purchaseOrderId: orderId,
      receivedDate,
      items,
      notes,
    });
  };

  const eligibleOrders = orders.filter((order: PurchaseOrder) =>
    ["sent", "approved", "partially_received"].includes(order.status),
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Purchase order *</Label>
          <Select value={orderId} onValueChange={setOrderId}>
            <SelectTrigger>
              <SelectValue placeholder="Select purchase order" />
            </SelectTrigger>
            <SelectContent>
              {eligibleOrders.map((order) => (
                <SelectItem key={order.id} value={order.id}>
                  {order.orderNumber} — {order.supplierName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Received date *</Label>
          <Input
            type="date"
            value={receivedDate}
            onChange={(event) => setReceivedDate(event.target.value)}
            required
          />
        </div>
      </div>

      {selectedOrder && (
        <div className="space-y-4">
          <h3 className="font-semibold">Received items</h3>

          {items.length === 0 && (
            <p className="rounded-lg border p-4 text-sm text-muted-foreground">
              All items on this purchase order have already been received.
            </p>
          )}

          {items.map((item, index) => (
            <div
              key={item.purchaseOrderItemId}
              className="space-y-3 rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-muted-foreground">
                  SKU: {item.sku} · Remaining: {item.orderedQuantity}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Received quantity</Label>
                  <Input
                    type="number"
                    min="0"
                    max={item.orderedQuantity}
                    value={item.receivedQuantity}
                    onChange={(event) =>
                      updateItem(
                        index,
                        "receivedQuantity",
                        Number(event.target.value),
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Accepted quantity</Label>
                  <Input
                    type="number"
                    min="0"
                    value={item.acceptedQuantity}
                    onChange={(event) =>
                      updateItem(
                        index,
                        "acceptedQuantity",
                        Number(event.target.value),
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rejected quantity</Label>
                  <Input
                    type="number"
                    min="0"
                    value={item.rejectedQuantity}
                    onChange={(event) =>
                      updateItem(
                        index,
                        "rejectedQuantity",
                        Number(event.target.value),
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Item notes</Label>
                <Input
                  value={item.notes ?? ""}
                  onChange={(event) =>
                    updateItem(index, "notes", event.target.value)
                  }
                  placeholder="Condition, damages, discrepancies..."
                />
              </div>

              {item.acceptedQuantity + item.rejectedQuantity >
                item.receivedQuantity && (
                <p className="text-sm text-destructive">
                  Accepted and rejected quantities cannot exceed the received
                  quantity.
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <Label>Receipt notes</Label>
        <Textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="General receiving notes..."
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !orderId || items.length === 0}
        >
          {isSubmitting ? "Recording..." : "Record goods receipt"}
        </Button>
      </div>
    </form>
  );
}
