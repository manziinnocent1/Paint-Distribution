import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getContrastColor,
  hexToRgb,
  isValidHex,
  normalizeHex,
} from "../../utils/color.utils";

interface ColorPreviewProps {
  hex: string;
  name?: string;
  className?: string;
}

export function ColorPreview({
  hex,
  name = "Color preview",
  className,
}: ColorPreviewProps) {
  const [copied, setCopied] = useState(false);

  const valid = isValidHex(hex);
  const normalized = valid ? normalizeHex(hex) : "#E5E7EB";

  const copyHex = async () => {
    if (!valid) return;

    try {
      await navigator.clipboard.writeText(normalized);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={cn("overflow-hidden rounded-xl border", className)}>
      <div
        className="flex h-32 items-center justify-center"
        style={{ backgroundColor: normalized }}
      >
        <span
          className="text-2xl font-semibold"
          style={{ color: getContrastColor(normalized) }}
        >
          Aa
        </span>
      </div>

      <div className="flex items-center justify-between p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {valid ? hexToRgb(normalized) : "Invalid HEX value"}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={!valid}
          onClick={copyHex}
          aria-label="Copy HEX code"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
