import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import BrandForm from "../components/BrandForm";
import { catalogService } from "../services/catalogService";

import type { BrandFormValues } from "../types/catalog.types";

export default function CreateBrandPage() {
  const navigate = useNavigate();

  const handleCreate = async (values: BrandFormValues) => {
    await catalogService.createBrand(values);
    navigate("/catalog/brands");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          to="/catalog/brands"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to brands
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">Create Brand</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a paint brand or manufacturer to your catalog.
        </p>
      </div>

      <BrandForm onSubmit={handleCreate} submitLabel="Create brand" />
    </div>
  );
}
