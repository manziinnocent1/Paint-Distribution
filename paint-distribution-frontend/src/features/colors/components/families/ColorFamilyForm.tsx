import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { colorFamilySchema } from "../../schemas/color.schema";

import type {
  ColorFamily,
  ColorFamilyFormValues,
} from "../../types/color.types";

import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";

interface ColorFamilyFormProps {
  initialData?: ColorFamily;
  onSubmit: (values: ColorFamilyFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function ColorFamilyForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ColorFamilyFormProps) {
  const form = useForm<ColorFamilyFormValues, unknown, ColorFamilyFormValues>({
    resolver: zodResolver(colorFamilySchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      is_active: true,
    },
  });

  useEffect(() => {
    form.reset({
      name: initialData?.name ?? "",
      code: initialData?.code ?? "",
      description: initialData?.description ?? "",
      is_active: initialData?.is_active ?? true,
    });
  }, [initialData, form]);

  const handleFormSubmit: SubmitHandler<ColorFamilyFormValues> = (values) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Family name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Blues" {...field} />
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
              <FormLabel>Family code</FormLabel>
              <FormControl>
                <Input placeholder="e.g. FAM-BLUES" {...field} />
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
                  placeholder="Describe this color family..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <FormLabel>Active family</FormLabel>
                <p className="text-xs text-muted-foreground">
                  Make this family available for use.
                </p>
              </div>

              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : initialData
                ? "Update family"
                : "Create family"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
