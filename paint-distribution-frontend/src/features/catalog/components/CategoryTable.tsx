import { Link } from "react-router-dom";
import { Eye, FolderTree } from "lucide-react";

import type { Category } from "../types/catalog.types";

interface CategoryTableProps {
  categories: Category[];
  loading?: boolean;
}

export default function CategoryTable({
  categories,
  loading = false,
}: CategoryTableProps) {
  if (loading) {
    return <div className="h-48 animate-pulse rounded-xl bg-gray-100" />;
  }

  if (!categories.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <FolderTree className="mx-auto text-gray-400" size={30} />
        <p className="mt-3 font-medium text-gray-900">No categories found</p>
        <p className="mt-1 text-sm text-gray-500">
          Create a category to organize your products.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-5 py-4 font-medium">Category</th>
            <th className="px-5 py-4 font-medium">Parent category</th>
            <th className="px-5 py-4 font-medium">Products</th>
            <th className="px-5 py-4 font-medium">Status</th>
            <th className="px-5 py-4 text-right font-medium">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="px-5 py-4 font-medium text-gray-900">
                {category.name}
              </td>
              <td className="px-5 py-4 text-gray-600">
                {category.parent_name ?? "—"}
              </td>
              <td className="px-5 py-4 text-gray-600">
                {category.product_count ?? "—"}
              </td>
              <td className="px-5 py-4">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    category.is_active
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {category.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-5 py-4 text-right">
                <Link
                  to={`/catalog/categories/${category.id}/edit`}
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
