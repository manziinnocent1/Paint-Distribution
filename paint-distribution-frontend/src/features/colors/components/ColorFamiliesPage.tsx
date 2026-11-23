import { useState } from "react";
import { Plus, Layers } from "lucide-react";

import type { ColorFamily, ColorFamilyFormValues } from "../types/color.types";

import { useColorFamilies } from "../hooks/useColorFamilies";
import { useColors } from "../hooks/useColors";
import { useColorFamilyMutations } from "../hooks/useColorMutations";

import { ColorFamilyTable } from "../components/families/ColorFamilyTable";
import { ColorFamilyForm } from "../components/families/ColorFamilyForm";
import { ColorFamilyDetails } from "../components/families/ColorFamilyDetails";

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

export default function ColorFamiliesPage() {
  const [selected, setSelected] = useState<ColorFamily | undefined>();
  const [mode, setMode] = useState<"create" | "edit" | "view" | null>(null);

  const { data, isLoading, isError, error, refetch } = useColorFamilies({
    page: 1,
    page_size: 100,
  });

  const { data: colorData } = useColors({ page_size: 100 });

  const mutations = useColorFamilyMutations();

  const families = data?.results ?? [];
  const colors = colorData?.results ?? [];

  const open = (nextMode: "create" | "edit" | "view", family?: ColorFamily) => {
    setSelected(family);
    setMode(nextMode);
  };

  const close = () => {
    setMode(null);
    setSelected(undefined);
  };

  const handleSubmit = async (values: ColorFamilyFormValues) => {
    try {
      if (mode === "edit" && selected) {
        await mutations.updateFamily.mutateAsync({
          id: selected.id,
          payload: values,
        });
        toast.success("Color family updated successfully.");
      } else {
        await mutations.createFamily.mutateAsync(values);
        toast.success("Color family created successfully.");
      }

      close();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save family.",
      );
    }
  };

  const handleDelete = async (family: ColorFamily) => {
    if (!window.confirm(`Delete color family "${family.name}"?`)) return;

    try {
      await mutations.deleteFamily.mutateAsync(family.id);
      toast.success("Color family deleted successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete family.",
      );
    }
  };

  const activeCount = families.filter((family) => family.is_active).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Color Families</h1>
          <p className="text-sm text-muted-foreground">
            Organize your paint colors into manageable families.
          </p>
        </div>

        <Button onClick={() => open("create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add family
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <Layers className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total families</p>
              <p className="text-2xl font-bold">{data?.count ?? 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div>
              <p className="text-sm text-muted-foreground">Active families</p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="rounded-lg border p-12 text-center text-muted-foreground">
          Loading color families...
        </div>
      ) : isError ? (
        <div className="rounded-lg border p-10 text-center">
          <p className="text-sm text-destructive">
            {error instanceof Error
              ? error.message
              : "Unable to load families."}
          </p>
          <Button className="mt-3" variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <ColorFamilyTable
          families={families}
          onView={(family) => open("view", family)}
          onEdit={(family) => open("edit", family)}
          onDelete={handleDelete}
        />
      )}

      <Dialog
        open={mode !== null}
        onOpenChange={(openState) => !openState && close()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {mode === "create"
                ? "Create color family"
                : mode === "edit"
                  ? "Edit color family"
                  : "Family details"}
            </DialogTitle>
            <DialogDescription>
              Manage the information for this color family.
            </DialogDescription>
          </DialogHeader>

          {mode === "view" && selected && (
            <ColorFamilyDetails family={selected} colors={colors} />
          )}

          {(mode === "create" || mode === "edit") && (
            <ColorFamilyForm
              initialData={selected}
              onSubmit={handleSubmit}
              onCancel={close}
              isSubmitting={
                mutations.createFamily.isPending ||
                mutations.updateFamily.isPending
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
