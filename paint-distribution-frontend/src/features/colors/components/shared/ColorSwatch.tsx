import { cn } from "@/lib/utils";
import {
  getContrastColor,
  isValidHex,
  normalizeHex,
} from "../../utils/color.utils";

interface ColorSwatchProps {
  color: string;
  size?: "sm" | "md" | "lg";
  showCode?: boolean;
  className?: string;
}

const sizes = {
  sm: "h-7 w-7",
  md: "h-10 w-10",
  lg: "h-16 w-16",
};

export function ColorSwatch({
  color,
  size = "md",
  showCode = false,
  className,
}: ColorSwatchProps) {
  const valid = isValidHex(color);
  const hex = valid ? normalizeHex(color) : "#E5E7EB";

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg border border-black/10 shadow-sm",
          sizes[size],
          className,
        )}
        style={{ backgroundColor: hex }}
        title={hex}
      >
        <span
          className="text-[10px] font-bold"
          style={{ color: getContrastColor(hex) }}
        >
          {!valid ? "?" : ""}
        </span>
      </div>

      {showCode && (
        <span className="font-mono text-xs text-muted-foreground">
          {valid ? hex : "Invalid color"}
        </span>
      )}
    </div>
  );
}
