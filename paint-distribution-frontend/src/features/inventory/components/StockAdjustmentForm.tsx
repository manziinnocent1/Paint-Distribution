import { useState, type FormEvent } from "react";

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

import type {
  MovementType,
  StockAdjustmentValues,
  StockItem,
} from "../types/inventory.types";

interface Props {
  items: StockItem[];
  onSubmit: (values: StockAdjustmentValues) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export function StockAdjustmentForm({
  items,
  onSubmit,
  isSubmitting = false,
  onCancel,
}: Props) {
  const [stockItemId, setStockItemId] = useState("");
  const [movementType, setMovementType] = useState<MovementType>("stock_in");
  const [quantity, setQuantity] = useState("1");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [reason, setReason] = useState("");
  const [movementDate, setMovementDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [error, setError] = useState("");

  const selectedItem = items.find((item) => item.id === stockItemId);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const numericQuantity = Number(quantity);

    if (!stockItemId) {
      setError("Select a product.");
      return;
    }

    if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
      setError("Enter a valid quantity greater than zero.");
      return;
    }

    if (!referenceNumber.trim() || !reason.trim() || !movementDate) {
      setError("Complete all required fields.");
      return;
    }

    if (
      movementType === "stock_out" &&
      selectedItem &&
      numericQuantity > selectedItem.quantity - selectedItem.reservedQuantity
    ) {
      setError("Quantity exceeds the available stock.");
      return;
    }

    onSubmit({
      stockItemId,
      movementType,
      quantity: numericQuantity,
      referenceNumber: referenceNumber.trim(),
      reason: reason.trim(),
      movementDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label>Product *</Label>

        <Select value={stockItemId} onValueChange={setStockItemId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a stock item" />
          </SelectTrigger>

          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.productName} ({item.productSku})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedItem && (
          <p className="text-xs text-muted-foreground">
            Current quantity: {selectedItem.quantity} {selectedItem.unit} ·
            Available: {selectedItem.quantity - selectedItem.reservedQuantity}{" "}
            {selectedItem.unit}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Movement type *</Label>

        <Select
          value={movementType}
          onValueChange={(value) => setMovementType(value as MovementType)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="stock_in">Stock in</SelectItem>
            <SelectItem value="stock_out">Stock out</SelectItem>
            <SelectItem value="adjustment">Set physical stock count</SelectItem>
          </SelectContent>
        </Select>

        {movementType === "adjustment" && (
          <p className="text-xs text-muted-foreground">
            For adjustments, enter the new total physical quantity, not the
            difference.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>
          {movementType === "adjustment"
            ? "New physical quantity *"
            : "Quantity *"}
        </Label>

        <Input
          type="number"
          min="1"
          step="1"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Reference number *</Label>
        <Input
          value={referenceNumber}
          onChange={(event) => setReferenceNumber(event.target.value)}
          placeholder="e.g. ADJ-2026-001"
        />
      </div>

      <div className="space-y-2">
        <Label>Reason *</Label>
        <Textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Explain why this movement is being recorded..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Movement date *</Label>
        <Input
          type="date"
          value={movementDate}
          onChange={(event) => setMovementDate(event.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save adjustment"}
        </Button>
      </div>
    </form>
  );
}
