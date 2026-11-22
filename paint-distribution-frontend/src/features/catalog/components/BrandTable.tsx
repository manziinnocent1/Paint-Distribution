import { Link } from "react-router-dom";
import { Eye, Tag } from "lucide-react";

import type { Brand } from "../types/catalog.types";

interface BrandTableProps {
  brands: Brand[];
  loading?: boolean;
}

export default function BrandTable({
  brands,
  loading = false,
}: BrandTableProps) {
  if (loading) {
    return <div className="h-48 animate-pulse rounded-xl bg-gray-100" />;
  }

  if (!brands.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <Tag className="mx-auto text-gray-400" size={30} />
        <p className="mt-3 font-medium text-gray-900">No brands found</p>
        <p className="mt-1 text-sm text-gray-500">
          Add a brand to associate it with your products.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-5 py-4 font-medium">Brand</th>
            <th className="px-5 py-4 font-medium">Website</th>
            <th className="px-5 py-4 font-medium">Products</th>
            <th className="px-5 py-4 font-medium">Status</th>
            <th className="px-5 py-4 text-right font-medium">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {brands.map((brand) => (
            <tr key={brand.id} className="hover:bg-gray-50">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      className="h-9 w-9 rounded-lg border border-gray-100 object-contain"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 font-semibold text-gray-500">
                      {brand.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium text-gray-900">
                    {brand.name}
                  </span>
                </div>
              </td>
              <td className="px-5 py-4 text-gray-600">
                {brand.website ? (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {brand.website}
                  </a>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-5 py-4 text-gray-600">
                {brand.product_count ?? "—"}
              </td>
              <td className="px-5 py-4">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    brand.is_active
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {brand.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-5 py-4 text-right">
                <Link
                  to={`/catalog/brands/${brand.id}/edit`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  <Eye size={14} />
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
