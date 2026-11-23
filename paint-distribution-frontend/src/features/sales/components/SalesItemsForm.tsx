import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SaleItemInput } from "../types/sales.types";

type Props = {
  items: SaleItemInput[];
  onChange: (items: SaleItemInput[]) => void;
};

const emptyItem: SaleItemInput = {
  productId: "",
  productName: "",
  productSku: "",
  quantity: 1,
  unitPrice: 0,
  discountPercentage: 0,
  taxPercentage: 18,
};

export function SalesItemsForm({ items, onChange }: Props) {
  const [showErrors, setShowErrors] = useState(false);

  const updateItem = (
    index: number,
    field: keyof SaleItemInput,
    value: string | number,
  ) => {
    onChange(
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addItem = () => {
    onChange([...items, { ...emptyItem }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const invalid =
          showErrors &&
          (!item.productName.trim() ||
            !item.productId.trim() ||
            !item.productSku.trim() ||
            item.quantity <= 0 ||
            item.unitPrice < 0);

        return (
          <div key={index} className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">Product {index + 1}</p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={items.length === 1}
                onClick={() => removeItem(index)}
                aria-label={`Remove product ${index + 1}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Input
                placeholder="Product ID"
                value={item.productId}
                onChange={(event) =>
                  updateItem(index, "productId", event.target.value)
                }
              />
              <Input
                placeholder="Product name"
                value={item.productName}
                onChange={(event) =>
                  updateItem(index, "productName", event.target.value)
                }
              />
              <Input
                placeholder="SKU"
                value={item.productSku}
                onChange={(event) =>
                  updateItem(index, "productSku", event.target.value)
                }
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <Input
                type="number"
                min="1"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(event) =>
                  updateItem(index, "quantity", Number(event.target.value))
                }
              />
              <Input
                type="number"
                min="0"
                placeholder="Unit price"
                value={item.unitPrice}
                onChange={(event) =>
                  updateItem(index, "unitPrice", Number(event.target.value))
                }
              />
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="Discount %"
                value={item.discountPercentage}
                onChange={(event) =>
                  updateItem(
                    index,
                    "discountPercentage",
                    Number(event.target.value),
                  )
                }
              />
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="Tax %"
                value={item.taxPercentage}
                onChange={(event) =>
                  updateItem(index, "taxPercentage", Number(event.target.value))
                }
              />
            </div>

            {invalid && (
              <p className="text-sm text-destructive">
                Enter a product ID, name, SKU, valid quantity, and unit price.
              </p>
            )}
          </div>
        );
      })}

      {showErrors && items.length === 0 && (
        <p className="text-sm text-destructive">Add at least one product.</p>
      )}

      <Button type="button" variant="outline" onClick={addItem}>
        <Plus className="mr-2 h-4 w-4" />
        Add product
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="ml-2"
        onClick={() => setShowErrors(true)}
      >
        Validate products
      </Button>
    </div>
  );
}
