import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import BrandForm from "../components/BrandForm";
import { catalogService } from "../services/catalogService";

import type { Brand, BrandFormValues } from "../types/catalog.types";

export default function EditBrandPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const result = await catalogService.getBrand(id);
        setBrand(result);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unable to load brand.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const handleUpdate = async (values: BrandFormValues) => {
    if (!id) return;

    await catalogService.updateBrand(id, values);
    navigate("/catalog/brands");
  };

  if (loading) {
    return <div className="h-48 animate-pulse rounded-xl bg-gray-100" />;
  }

  if (error || !brand) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error ?? "Brand not found."}
      </div>
    );
  }

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

        <h1 className="text-2xl font-bold text-gray-900">Edit Brand</h1>
      </div>

      <BrandForm
        initialValues={{
          name: brand.name,
          description: brand.description ?? "",
          website: brand.website ?? "",
          is_active: brand.is_active,
        }}
        onSubmit={handleUpdate}
        submitLabel="Update brand"
      />
    </div>
  );
}
