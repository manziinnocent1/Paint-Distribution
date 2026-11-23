import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { colorSchema } from "../schemas/color.schema";

import type { Color, ColorFormValues } from "../types/color.types";

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

import { ColorPreview } from "./shared/ColorPreview";
import { useColorFamilies } from "../hooks/useColorFamilies";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { hexToRgb } from "../utils/color.utils";

interface ColorFormProps {
  initialData?: Color;
  onSubmit: (values: ColorFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function ColorForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ColorFormProps) {
  const { data: familyData } = useColorFamilies({
    is_active: true,
    page_size: 100,
  });

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      name: "",
      code: "",
      hex_code: "#6366F1",
      rgb_value: "",
      description: "",
      family: "",
      is_active: true,
    },
  });

  const hex = form.watch("hex_code");

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        code: initialData.code,
        hex_code: initialData.hex_code,
        rgb_value: initialData.rgb_value ?? "",
        description: initialData.description ?? "",
        family: initialData.family ?? "",
        is_active: initialData.is_active,
      });
    }
  }, [initialData, form]);

  useEffect(() => {
    if (/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) {
      form.setValue("rgb_value", hexToRgb(hex));
    }
  }, [hex, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Ocean Blue" {...field} />
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
                  <FormLabel>Color code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. CLR-OCEAN-BLUE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hex_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HEX color code</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        className="w-14 cursor-pointer p-1"
                        value={
                          /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(
                            field.value,
                          )
                            ? field.value
                            : "#6366F1"
                        }
                        onChange={(event) =>
                          field.onChange(event.target.value.toUpperCase())
                        }
                      />
                      <Input
                        placeholder="#FFFFFF"
                        {...field}
                        onChange={(event) =>
                          field.onChange(event.target.value.toUpperCase())
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rgb_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RGB value</FormLabel>
                  <FormControl>
                    <Input placeholder="rgb(255, 255, 255)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="family"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color family</FormLabel>
                  <Select
                    value={field.value || "__none__"}
                    onValueChange={(value) =>
                      field.onChange(value === "__none__" ? "" : value)
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a family" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="__none__">No family</SelectItem>
                      {familyData?.results.map((family) => (
                        <SelectItem key={family.id} value={family.id}>
                          {family.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      placeholder="Describe this paint color..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Live preview</p>
            <ColorPreview hex={hex} name={form.watch("name") || "New color"} />
          </div>
        </div>

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <FormLabel>Active color</FormLabel>
                <p className="text-xs text-muted-foreground">
                  Make this color available for use.
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
                ? "Update color"
                : "Create color"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
