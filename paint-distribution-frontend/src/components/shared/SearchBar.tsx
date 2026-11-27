import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounce?: number;
  disabled?: boolean;
  className?: string;
  onSubmit?: (value: string) => void;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  debounce = 0,
  disabled = false,
  className,
  onSubmit,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = React.useState(value);

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  React.useEffect(() => {
    if (debounce <= 0) return;

    const timeout = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, debounce);

    return () => clearTimeout(timeout);
  }, [internalValue, debounce, onChange, value]);

  const handleChange = (nextValue: string) => {
    setInternalValue(nextValue);

    if (debounce <= 0) {
      onChange(nextValue);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onChange(internalValue);
    onSubmit?.(internalValue);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

        <input
          type="search"
          value={internalValue}
          disabled={disabled}
          onChange={(event) => handleChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
        />

        {internalValue && (
          <button
            type="button"
            aria-label="Clear search"
            disabled={disabled}
            onClick={() => handleChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
}
