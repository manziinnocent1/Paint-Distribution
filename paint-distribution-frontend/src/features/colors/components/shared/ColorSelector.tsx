import { useColors } from "../../hooks/useColors";
import { ColorSwatch } from "./ColorSwatch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface ColorSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  excludeId?: string;
  disabled?: boolean;
}

export function ColorSelector({
  value,
  onChange,
  placeholder = "Select a color",
  excludeId,
  disabled = false,
}: ColorSelectorProps) {
  const { data, isLoading } = useColors({
    is_active: true,
    page_size: 100,
  });

  const colors = (data?.results ?? []).filter(
    (color) => color.id !== excludeId,
  );

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled || isLoading}
    >
      <SelectTrigger>
        {isLoading ? (
          <span className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading colors...
          </span>
        ) : (
          <SelectValue placeholder={placeholder} />
        )}
      </SelectTrigger>

      <SelectContent>
        {colors.length === 0 ? (
          <div className="px-3 py-4 text-center text-sm text-muted-foreground">
            No colors available
          </div>
        ) : (
          colors.map((color) => (
            <SelectItem key={color.id} value={color.id}>
              <span className="flex items-center gap-2">
                <ColorSwatch color={color.hex_code} size="sm" />
                <span>{color.name}</span>
                <span className="text-xs text-muted-foreground">
                  {color.code}
                </span>
              </span>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
