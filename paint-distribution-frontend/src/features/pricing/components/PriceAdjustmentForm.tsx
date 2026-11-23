import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import type { ProductPrice } from "../types/pricing.types";
import { useAdjustPrice } from "../hooks/usePricingMutations";

interface Props {
  price: ProductPrice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PriceAdjustmentForm({ price, open, onOpenChange }: Props) {
  const [adjustmentType, setAdjustmentType] = useState<"percentage" | "fixed">(
    "percentage",
  );
  const [direction, setDirection] = useState<"increase" | "decrease">(
    "increase",
  );
  const [adjustmentValue, setAdjustmentValue] = useState("0");
  const [reason, setReason] = useState("");

  const mutation = useAdjustPrice();

  async function submit() {
    const value = Number(adjustmentValue);

    if (!Number.isFinite(value) || value <= 0) {
      toast.error("Enter an adjustment greater than zero.");
      return;
    }

    if (!reason.trim() || reason.trim().length < 5) {
      toast.error("Please provide a reason of at least five characters.");
      return;
    }

    try {
      await mutation.mutateAsync({
        id: price.id,
        input: {
          adjustmentType,
          direction,
          adjustmentValue: value,
          reason: reason.trim(),
        },
      });

      toast.success("Price adjusted successfully.");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to adjust price.",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust selling price</DialogTitle>
          <DialogDescription>
            Current price:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: price.currency,
              maximumFractionDigits: 0,
            }).format(price.sellingPrice)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Adjustment direction</Label>
            <Select
              value={direction}
              onValueChange={(value: "increase" | "decrease") =>
                setDirection(value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="increase">Increase price</SelectItem>
                <SelectItem value="decrease">Decrease price</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Adjustment type</Label>
            <Select
              value={adjustmentType}
              onValueChange={(value: "percentage" | "fixed") =>
                setAdjustmentType(value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              {adjustmentType === "percentage"
                ? "Percentage (%)"
                : `Amount (${price.currency})`}
            </Label>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={adjustmentValue}
              onChange={(event) => setAdjustmentValue(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Reason for adjustment</Label>
            <Textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Explain why this price is changing..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Apply adjustment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
