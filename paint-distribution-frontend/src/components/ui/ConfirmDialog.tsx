import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      size="sm"
      showCloseButton={false}
      closeOnBackdrop={!loading}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={
            variant === "danger"
              ? "mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600"
              : "mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600"
          }
        >
          <AlertTriangle className="h-6 w-6" />
        </div>

        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

        <p className="mt-2 text-sm text-gray-500">{description}</p>

        <div className="mt-6 flex w-full gap-3">
          <Button
            variant="outline"
            fullWidth
            disabled={loading}
            onClick={onClose}
          >
            {cancelText}
          </Button>

          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            fullWidth
            isLoading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
