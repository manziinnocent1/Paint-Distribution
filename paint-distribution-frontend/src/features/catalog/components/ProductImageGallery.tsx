import { ImageOff } from "lucide-react";

import type { ProductImage } from "../types/catalog.types";

interface ProductImageGalleryProps {
  images: ProductImage[];
}

export default function ProductImageGallery({
  images,
}: ProductImageGalleryProps) {
  if (!images.length) {
    return (
      <div className="flex min-h-56 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-400">
        <div className="text-center">
          <ImageOff className="mx-auto" size={32} />
          <p className="mt-2 text-sm">No product images available</p>
        </div>
      </div>
    );
  }

  const orderedImages = [...images].sort(
    (a, b) =>
      Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary)) ||
      (a.display_order ?? 0) - (b.display_order ?? 0),
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {orderedImages.map((image, index) => (
        <div
          key={image.id ?? `${image.image}-${index}`}
          className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
        >
          <img
            src={image.image}
            alt={image.alt_text || `Product image ${index + 1}`}
            className="h-40 w-full object-cover"
          />

          {image.is_primary && (
            <span className="absolute left-2 top-2 rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white">
              Primary
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
