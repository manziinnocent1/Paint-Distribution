import { useState } from "react";
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
import {
  PROCUREMENT_DEPARTMENTS,
  PROCUREMENT_PRIORITIES,
} from "../constants/procurement.constants";
import type {
  ProcurementPriority,
  ProcurementRequest,
  ProcurementRequestInput,
} from "../types/procurement.types";
import {
  calculateRequestTotal,
  formatProcurementCurrency,
} from "../utils/procurement.utils";

interface Props {
  initialData?: ProcurementRequest;
  isSubmitting?: boolean;
  onSubmit: (input: ProcurementRequestInput) => void;
}

type FormItem = ProcurementRequestInput["items"][number];

const emptyItem: FormItem = {
  productId: "",
  productName: "",
  sku: "",
  quantity: 1,
  estimatedUnitPrice: 0,
  notes: "",
};

export function ProcurementForm({
  initialData,
  isSubmitting,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [department, setDepartment] = useState(
    initialData?.department ?? "Inventory",
  );
  const [priority, setPriority] = useState<ProcurementPriority>(
    initialData?.priority ?? "medium",
  );
  const [requiredDate, setRequiredDate] = useState(
    initialData?.requiredDate ?? "",
  );
  const [items, setItems] = useState<FormItem[]>(
    initialData?.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      estimatedUnitPrice: item.estimatedUnitPrice,
      notes: item.notes,
    })) ?? [{ ...emptyItem }],
  );
  const [error, setError] = useState("");

  const updateItem = (
    index: number,
    field: keyof FormItem,
    value: string | number,
  ) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const total = calculateRequestTotal(
    items.map((item, index) => ({
      ...item,
      id: String(index),
    })),
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!title.trim() || !description.trim() || !requiredDate) {
      setError("Complete all required request information.");
      return;
    }

    if (
      items.some(
        (item) =>
          !item.productId.trim() ||
          !item.productName.trim() ||
          !item.sku.trim() ||
          item.quantity <= 0 ||
          item.estimatedUnitPrice < 0,
      )
    ) {
      setError("Complete all product item fields with valid values.");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      department,
      priority,
      requiredDate,
      items,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Request title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Restock interior paint"
            required
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Explain the procurement requirement..."
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Department *</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROCUREMENT_DEPARTMENTS.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Priority *</Label>
          <Select
            value={priority}
            onValueChange={(value) => setPriority(value as ProcurementPriority)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROCUREMENT_PRIORITIES.map((value) => (
                <SelectItem key={value.value} value={value.value}>
                  {value.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="requiredDate">Required date *</Label>
          <Input
            id="requiredDate"
            type="date"
            value={requiredDate}
            onChange={(event) => setRequiredDate(event.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold">Requested products</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setItems((current) => [...current, { ...emptyItem }])
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add product
          </Button>
        </div>

        {items.map((item, index) => (
          <div
            key={index}
            className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div className="space-y-2">
              <Label>Product name *</Label>
              <Input
                value={item.productName}
                onChange={(event) =>
                  updateItem(index, "productName", event.target.value)
                }
                placeholder="Product name"
              />
            </div>

            <div className="space-y-2">
              <Label>Product ID *</Label>
              <Input
                value={item.productId}
                onChange={(event) =>
                  updateItem(index, "productId", event.target.value)
                }
                placeholder="Product ID"
              />
            </div>

            <div className="space-y-2">
              <Label>SKU *</Label>
              <Input
                value={item.sku}
                onChange={(event) =>
                  updateItem(index, "sku", event.target.value)
                }
                placeholder="SKU"
              />
            </div>

            <div className="space-y-2">
              <Label>Quantity *</Label>
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
              <Label>Estimated unit price (RWF) *</Label>
              <Input
                type="number"
                min="0"
                value={item.estimatedUnitPrice}
                onChange={(event) =>
                  updateItem(
                    index,
                    "estimatedUnitPrice",
                    Number(event.target.value),
                  )
                }
              />
            </div>

            <div className="flex items-end justify-between gap-2">
              <p className="pb-2 text-sm font-medium">
                {formatProcurementCurrency(
                  item.quantity * item.estimatedUnitPrice,
                )}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={items.length === 1}
                onClick={() =>
                  setItems((current) =>
                    current.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <div className="space-y-2 sm:col-span-2 lg:col-span-3">
              <Label>Item notes</Label>
              <Input
                value={item.notes ?? ""}
                onChange={(event) =>
                  updateItem(index, "notes", event.target.value)
                }
                placeholder="Optional product specifications"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end rounded-lg bg-muted/50 p-4">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Estimated total</p>
          <p className="text-2xl font-bold">
            {formatProcurementCurrency(total)}
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Update request"
              : "Create request"}
        </Button>
      </div>
    </form>
  );
}
