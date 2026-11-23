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
import type { Payment } from "../types/payment.types";
import { useRefundPayment } from "../hooks/usePaymentMutations";

interface Props {
  payment: Payment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentRefundDialog({ payment, open, onOpenChange }: Props) {
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState(String(payment.amount));
  const refundPayment = useRefundPayment();

  async function handleRefund() {
    const refundAmount = Number(amount);

    if (!reason.trim() || reason.trim().length < 5) {
      toast.error("Please enter a refund reason of at least five characters.");
      return;
    }

    if (
      !Number.isFinite(refundAmount) ||
      refundAmount <= 0 ||
      refundAmount > payment.amount
    ) {
      toast.error("Enter a valid refund amount.");
      return;
    }

    try {
      await refundPayment.mutateAsync({
        id: payment.id,
        input: {
          reason: reason.trim(),
          amount: refundAmount,
        },
      });

      toast.success("Refund recorded.");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to process refund.",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refund payment</DialogTitle>
          <DialogDescription>
            Record a refund for {payment.paymentNumber}. This mock
            implementation updates the local payment record only.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="refund-amount">Refund amount</Label>
            <Input
              id="refund-amount"
              type="number"
              min="1"
              max={payment.amount}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="refund-reason">Reason</Label>
            <Textarea
              id="refund-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Explain why this payment is being refunded..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleRefund} disabled={refundPayment.isPending}>
            {refundPayment.isPending ? "Processing..." : "Confirm refund"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
