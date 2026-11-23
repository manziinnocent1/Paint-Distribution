import { useState } from "react";
import { Plus, Palette, Layers, CheckCircle2 } from "lucide-react";

import type {
  Color,
  ColorFilters as ColorFilterValues,
  ColorFormValues,
  CreateColorPayload,
} from "../types/color.types";

import { useColors } from "../hooks/useColors";
import { useColorMutations } from "../hooks/useColorMutations";

import { ColorTable } from "../components/ColorTable";
import { ColorCard } from "../components/ColorCard";
import { ColorForm } from "../components/ColorForm";
import { ColorDetails } from "../components/ColorDetails";
import { ColorFilters } from "../components/ColorFilters";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";

export default function ColorsPage() {
  const [filters, setFilters] = useState<ColorFilterValues>({
    search: "",
    family: "",
    ordering: "-created_at",
    page: 1,
    page_size: 10,
  });

  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const [selectedColor, setSelectedColor] = useState<Color | undefined>();
  const [dialogMode, setDialogMode] = useState<
    "create" | "edit" | "view" | null
  >(null);

  const { data, isLoading, isError, error, refetch } = useColors(filters);

  const mutations = useColorMutations();

  const colors = data?.results ?? [];

  const activeCount = colors.filter((color) => color.is_active).length;

  const openCreate = () => {
    setSelectedColor(undefined);
    setDialogMode("create");
  };

  const openView = (color: Color) => {
    setSelectedColor(color);
    setDialogMode("view");
  };

  const openEdit = (color: Color) => {
    setSelectedColor(color);
    setDialogMode("edit");
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedColor(undefined);
  };

  const handleSubmit = async (values: ColorFormValues) => {
    try {
      const payload: CreateColorPayload = {
        ...values,
        family: values.family || null,
      };

      if (dialogMode === "edit" && selectedColor) {
        await mutations.updateColor.mutateAsync({
          id: selectedColor.id,
          payload,
        });
        toast.success("Color updated successfully.");
      } else {
        await mutations.createColor.mutateAsync(payload);
        toast.success("Color created successfully.");
      }

      closeDialog();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save color.",
      );
    }
  };

  const handleDelete = async (color: Color) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${color.name}"?`,
    );

    if (!confirmed) return;

    try {
      await mutations.deleteColor.mutateAsync(color.id);
      toast.success("Color deleted successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete color.",
      );
    }
  };

  const total = data?.count ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Color Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage paint colors, color codes, and color families.
          </p>
        </div>

        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add color
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-primary/10 p-3">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total colors</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-green-500/10 p-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Active colors on page
              </p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-blue-500/10 p-3">
              <Layers className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Displayed colors</p>
              <p className="text-2xl font-bold">{colors.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <ColorFilters filters={filters} onChange={setFilters} />

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {colors.length} of {total} colors
          </p>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewMode === "table" ? "default" : "outline"}
              onClick={() => setViewMode("table")}
            >
              Table
            </Button>
            <Button
              size="sm"
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
            >
              Grid
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-lg border p-12 text-center text-sm text-muted-foreground">
            Loading colors...
          </div>
        ) : isError ? (
          <div className="rounded-lg border p-12 text-center">
            <p className="text-sm text-destructive">
              {error instanceof Error
                ? error.message
                : "Unable to load colors."}
            </p>
            <Button
              variant="outline"
              className="mt-3"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        ) : viewMode === "table" ? (
          <ColorTable
            colors={colors}
            onView={openView}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {colors.map((color) => (
              <ColorCard
                key={color.id}
                color={color}
                onView={openView}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
            {colors.length === 0 && (
              <div className="col-span-full">
                <p className="rounded-lg border p-10 text-center text-sm text-muted-foreground">
                  No colors found.
                </p>
              </div>
            )}
          </div>
        )}

        {total > (filters.page_size ?? 10) && (
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={(filters.page ?? 1) <= 1}
              onClick={() =>
                setFilters((previous) => ({
                  ...previous,
                  page: Math.max(1, (previous.page ?? 1) - 1),
                }))
              }
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {filters.page ?? 1} of{" "}
              {Math.ceil(total / (filters.page_size ?? 10))}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={
                (filters.page ?? 1) >=
                Math.ceil(total / (filters.page_size ?? 10))
              }
              onClick={() =>
                setFilters((previous) => ({
                  ...previous,
                  page: (previous.page ?? 1) + 1,
                }))
              }
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <Dialog
        open={dialogMode !== null}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create"
                ? "Create new color"
                : dialogMode === "edit"
                  ? "Edit color"
                  : "Color details"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "view"
                ? "Review the selected paint color."
                : "Enter the color information below."}
            </DialogDescription>
          </DialogHeader>

          {dialogMode === "view" && selectedColor && (
            <ColorDetails color={selectedColor} />
          )}

          {(dialogMode === "create" || dialogMode === "edit") && (
            <ColorForm
              initialData={selectedColor}
              onSubmit={handleSubmit}
              onCancel={closeDialog}
              isSubmitting={
                mutations.createColor.isPending ||
                mutations.updateColor.isPending
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
