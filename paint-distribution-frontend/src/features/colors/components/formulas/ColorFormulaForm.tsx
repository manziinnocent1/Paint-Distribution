import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { colorFormulaSchema } from "../../schemas/color.schema";

import type {
  ColorFormula,
  ColorFormulaFormValues,
} from "../../types/color.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ColorSelector } from "../shared/ColorSelector";
import { FormulaIngredientEditor } from "./FormulaIngredientEditor";

interface ColorFormulaFormProps {
  initialData?: ColorFormula;
  onSubmit: (values: ColorFormulaFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function ColorFormulaForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ColorFormulaFormProps) {
  const form = useForm<ColorFormulaFormValues>({
    resolver: zodResolver(colorFormulaSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      target_color: "",
      ingredients: [],
      is_active: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        code: initialData.code,
        description: initialData.description ?? "",
        target_color: initialData.target_color,
        ingredients: initialData.ingredients,
        is_active: initialData.is_active,
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Formula name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Ocean Blue Formula" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Formula code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. FRM-OCEAN-BLUE" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="target_color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target color</FormLabel>
              <FormControl>
                <ColorSelector
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select the color to produce"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the formula..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
          control={form.control}
          name="ingredients"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <FormulaIngredientEditor
                ingredients={field.value}
                onChange={field.onChange}
              />
              {fieldState.error?.message && (
                <p className="text-sm text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <FormLabel>Active formula</FormLabel>
                <p className="text-xs text-muted-foreground">
                  Make this formula available for use.
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : initialData
                ? "Update formula"
                : "Create formula"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
