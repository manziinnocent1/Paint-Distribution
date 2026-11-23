import { useEffect, useState, type FormEvent } from "react";

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

import type { Warehouse, WarehouseValues } from "../types/inventory.types";

interface Props {
  warehouse?: Warehouse | null;
  onSubmit: (values: WarehouseValues) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

const emptyValues: WarehouseValues = {
  name: "",
  code: "",
  description: "",
  address: "",
  city: "",
  managerName: "",
  contactNumber: "",
  status: "active",
};

export function WarehouseForm({
  warehouse,
  onSubmit,
  isSubmitting = false,
  onCancel,
}: Props) {
  const [values, setValues] = useState<WarehouseValues>(emptyValues);
  const [error, setError] = useState("");

  useEffect(() => {
    if (warehouse) {
      setValues({
        name: warehouse.name,
        code: warehouse.code,
        description: warehouse.description ?? "",
        address: warehouse.address,
        city: warehouse.city,
        managerName: warehouse.managerName ?? "",
        contactNumber: warehouse.contactNumber ?? "",
        status: warehouse.status,
      });
    } else {
      setValues(emptyValues);
    }

    setError("");
  }, [warehouse]);

  const update = <K extends keyof WarehouseValues>(
    key: K,
    value: WarehouseValues[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !values.name.trim() ||
      !values.code.trim() ||
      !values.address.trim() ||
      !values.city.trim()
    ) {
      setError("Complete all required fields.");
      return;
    }

    setError("");

    onSubmit({
      ...values,
      name: values.name.trim(),
      code: values.code.trim().toUpperCase(),
      address: values.address.trim(),
      city: values.city.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Warehouse name *</Label>
        <Input
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          placeholder="e.g. Kigali Main Warehouse"
        />
      </div>

      <div className="space-y-2">
        <Label>Warehouse code *</Label>
        <Input
          value={values.code}
          onChange={(event) => update("code", event.target.value)}
          placeholder="e.g. KGL-MAIN"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={values.description ?? ""}
          onChange={(event) => update("description", event.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Address *</Label>
        <Input
          value={values.address}
          onChange={(event) => update("address", event.target.value)}
          placeholder="Street or location"
        />
      </div>

      <div className="space-y-2">
        <Label>City *</Label>
        <Input
          value={values.city}
          onChange={(event) => update("city", event.target.value)}
          placeholder="City"
        />
      </div>

      <div className="space-y-2">
        <Label>Warehouse manager</Label>
        <Input
          value={values.managerName ?? ""}
          onChange={(event) => update("managerName", event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Contact number</Label>
        <Input
          value={values.contactNumber ?? ""}
          onChange={(event) => update("contactNumber", event.target.value)}
          placeholder="+250..."
        />
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={values.status}
          onValueChange={(value) =>
            update("status", value as WarehouseValues["status"])
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : warehouse
              ? "Update warehouse"
              : "Create warehouse"}
        </Button>
      </div>
    </form>
  );
}
