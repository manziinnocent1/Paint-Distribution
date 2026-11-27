import * as React from "react";
import { Upload, Image as ImageIcon, X, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export interface ImageUploadProps {
  value?: File | null;
  defaultPreview?: string;
  onChange: (file: File | null) => void;
  label?: string;
  description?: string;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function ImageUpload({
  value,
  defaultPreview,
  onChange,
  label = "Upload image",
  description = "PNG, JPG or WEBP",
  accept = "image/png,image/jpeg,image/webp",
  maxSizeMB = 5,
  disabled = false,
  error,
  className,
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [localError, setLocalError] = React.useState("");

  const [objectUrl, setObjectUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!value) {
      setObjectUrl(null);
      return;
    }

    const url = URL.createObjectURL(value);
    setObjectUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [value]);

  const previewUrl = objectUrl || defaultPreview;

  const validateAndUpload = (file?: File) => {
    if (!file) return;

    setLocalError("");

    const acceptedTypes = accept
      .split(",")
      .map((type) => type.trim().toLowerCase());

    const fileType = file.type.toLowerCase();

    const isAccepted = acceptedTypes.some((type) => {
      if (type.endsWith("/*")) {
        return fileType.startsWith(type.slice(0, -1));
      }

      return type === fileType;
    });

    if (!isAccepted) {
      setLocalError("Please select a supported image format.");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`Image size must not exceed ${maxSizeMB} MB.`);
      return;
    }

    onChange(file);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);

    if (disabled) return;

    validateAndUpload(event.dataTransfer.files?.[0]);
  };

  const handleRemove = () => {
    setLocalError("");
    onChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const displayedError = error || localError;

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>

        <span className="text-xs text-gray-400">Max {maxSizeMB} MB</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        className="hidden"
        onChange={(event) => {
          validateAndUpload(event.target.files?.[0]);
        }}
      />

      {previewUrl ? (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Selected image preview"
            className="h-44 w-44 rounded-xl border border-gray-200 object-cover"
          />

          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove image"
              className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1.5 text-white shadow hover:bg-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {!disabled && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Change image
            </button>
          )}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Choose an image to upload"
          aria-disabled={disabled}
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={(event) => {
            if (!disabled && (event.key === "Enter" || event.key === " ")) {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (!disabled) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex min-h-44 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-8 text-center transition-colors",
            dragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          )}
        >
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Upload className="h-5 w-5" />
          </div>

          <p className="text-sm font-medium text-gray-700">
            Click to upload or drag and drop
          </p>

          <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>
      )}

      {displayedError && (
        <p
          role="alert"
          className="flex items-center gap-1.5 text-xs text-red-600"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {displayedError}
        </p>
      )}

      {!previewUrl && !displayedError && (
        <p className="flex items-center gap-1.5 text-xs text-gray-400">
          <ImageIcon className="h-3.5 w-3.5" />
          Supported image formats only.
        </p>
      )}
    </div>
  );
}
