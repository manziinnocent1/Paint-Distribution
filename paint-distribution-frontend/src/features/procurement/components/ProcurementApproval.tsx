import { useState } from "react";
import { Check, X, Send, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useProcurementMutations } from "../hooks/useProcurementMutations";
import type { ProcurementRequest } from "../types/procurement.types";

export function ProcurementApproval({
  request,
}: {
  request: ProcurementRequest;
}) {
  const [reason, setReason] = useState("");
  const mutations = useProcurementMutations();

  const pending =
    mutations.approveRequest.isPending ||
    mutations.rejectRequest.isPending ||
    mutations.submitRequest.isPending ||
    mutations.cancelRequest.isPending;

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="font-semibold">Request actions</h3>

      {["draft", "rejected"].includes(request.status) && (
        <Button
          className="w-full"
          disabled={pending}
          onClick={() => mutations.submitRequest.mutate(request.id)}
        >
          <Send className="mr-2 h-4 w-4" />
          Submit for approval
        </Button>
      )}

      {request.status === "pending" && (
        <>
          <Button
            className="w-full"
            disabled={pending}
            onClick={() => mutations.approveRequest.mutate(request.id)}
          >
            <Check className="mr-2 h-4 w-4" />
            Approve request
          </Button>

          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Rejection reason</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Explain why this request is being rejected..."
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
            <Button
              variant="destructive"
              className="w-full"
              disabled={pending || reason.trim().length < 3}
              onClick={() =>
                mutations.rejectRequest.mutate({
                  id: request.id,
                  reason: reason.trim(),
                })
              }
            >
              <X className="mr-2 h-4 w-4" />
              Reject request
            </Button>
          </div>
        </>
      )}

      {!["received", "cancelled", "rejected"].includes(request.status) && (
        <Button
          variant="outline"
          className="w-full"
          disabled={pending}
          onClick={() => {
            if (window.confirm("Cancel this procurement request?")) {
              mutations.cancelRequest.mutate(request.id);
            }
          }}
        >
          <Ban className="mr-2 h-4 w-4" />
          Cancel request
        </Button>
      )}

      {request.rejectionReason && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          <strong>Rejection reason:</strong> {request.rejectionReason}
        </div>
      )}
    </div>
  );
}
