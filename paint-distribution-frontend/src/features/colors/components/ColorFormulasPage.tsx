import { useState } from "react";
import { Plus, Calculator } from "lucide-react";

import type {
  ColorFormula,
  ColorFormulaFormValues,
} from "../types/color.types";

import { useColorFormulas } from "../hooks/useColorFormulas";
import { useColorFormulaMutations } from "../hooks/useColorMutations";

import { ColorFormulaTable } from "../components/formulas/ColorFormulaTable";
import { ColorFormulaForm } from "../components/formulas/ColorFormulaForm";
import { FormulaDetails } from "../components/formulas/FormulaDetails";

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

export default function ColorFormulasPage() {
  const [selected, setSelected] = useState<ColorFormula | undefined>();
  const [mode, setMode] = useState<"create" | "edit" | "view" | null>(null);

  const { data, isLoading, isError, error, refetch } = useColorFormulas({
    page: 1,
    page_size: 100,
  });

  const mutations = useColorFormulaMutations();

  const formulas = data?.results ?? [];

  const open = (
    nextMode: "create" | "edit" | "view",
    formula?: ColorFormula,
  ) => {
    setSelected(formula);
    setMode(nextMode);
  };

  const close = () => {
    setMode(null);
    setSelected(undefined);
  };

  const handleSubmit = async (values: ColorFormulaFormValues) => {
    try {
      if (mode === "edit" && selected) {
        await mutations.updateFormula.mutateAsync({
          id: selected.id,
          payload: values,
        });
        toast.success("Color formula updated successfully.");
      } else {
        await mutations.createFormula.mutateAsync(values);
        toast.success("Color formula created successfully.");
      }

      close();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save formula.",
      );
    }
  };

  const handleDelete = async (formula: ColorFormula) => {
    if (!window.confirm(`Delete formula "${formula.name}"?`)) return;

    try {
      await mutations.deleteFormula.mutateAsync(formula.id);
      toast.success("Color formula deleted successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete formula.",
      );
    }
  };

  const activeCount = formulas.filter((item) => item.is_active).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Color Formulas</h1>
          <p className="text-sm text-muted-foreground">
            Manage paint mixing formulas and ingredient quantities.
          </p>
        </div>

        <Button onClick={() => open("create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create formula
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <Calculator className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total formulas</p>
              <p className="text-2xl font-bold">{data?.count ?? 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Active formulas</p>
            <p className="text-2xl font-bold">{activeCount}</p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="rounded-lg border p-12 text-center text-muted-foreground">
          Loading color formulas...
        </div>
      ) : isError ? (
        <div className="rounded-lg border p-10 text-center">
          <p className="text-sm text-destructive">
            {error instanceof Error
              ? error.message
              : "Unable to load formulas."}
          </p>
          <Button className="mt-3" variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <ColorFormulaTable
          formulas={formulas}
          onView={(formula) => open("view", formula)}
          onEdit={(formula) => open("edit", formula)}
          onDelete={handleDelete}
        />
      )}

      <Dialog
        open={mode !== null}
        onOpenChange={(openState) => !openState && close()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {mode === "create"
                ? "Create color formula"
                : mode === "edit"
                  ? "Edit color formula"
                  : "Formula details"}
            </DialogTitle>
            <DialogDescription>
              Define the target paint color and its ingredients.
            </DialogDescription>
          </DialogHeader>

          {mode === "view" && selected && <FormulaDetails formula={selected} />}

          {(mode === "create" || mode === "edit") && (
            <ColorFormulaForm
              initialData={selected}
              onSubmit={handleSubmit}
              onCancel={close}
              isSubmitting={
                mutations.createFormula.isPending ||
                mutations.updateFormula.isPending
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
