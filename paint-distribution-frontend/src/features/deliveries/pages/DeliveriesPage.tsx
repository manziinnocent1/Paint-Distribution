import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

import { DeliveryHeader } from "../components/overview/DeliveryHeader";
import { DeliveryStats } from "../components/overview/DeliveryStats";
import { DeliveryFilters } from "../components/forms/DeliveryFilters";
import { DeliveriesTable } from "../components/tables/DeliveriesTable";
import { DeliveryCard } from "../components/cards/DeliveryCard";

import { DEFAULT_DELIVERY_FILTERS } from "../constants/delivery.constants";
import { useDeliveries } from "../hooks/useDeliveries";
import { useDeliveryStats } from "../hooks/useDeliveryStats";
import { useDeliveryMutations } from "../hooks/useDeliveryMutations";
import type {
  Delivery,
  DeliveryFilters as DeliveryFiltersType,
} from "../types/delivery.types";

export function DeliveriesPage() {
  const [filters, setFilters] = useState<DeliveryFiltersType>({
    ...DEFAULT_DELIVERY_FILTERS,
  });

  const [actionError, setActionError] = useState("");

  const deliveriesQuery = useDeliveries(filters);
  const statsQuery = useDeliveryStats();
  const { deleteDelivery } = useDeliveryMutations();

  const deliveries = deliveriesQuery.data?.results ?? [];
  const pagination = deliveriesQuery.data;

  const handleDelete = async (delivery: Delivery) => {
    const confirmed = window.confirm(
      `Delete delivery ${delivery.deliveryNumber}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setActionError("");

    try {
      await deleteDelivery.mutateAsync(delivery.id);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to delete delivery.",
      );
    }
  };

  return (
    <main className="space-y-7 pb-8">
      <DeliveryHeader
        onRefresh={() => {
          void deliveriesQuery.refetch();
          void statsQuery.refetch();
        }}
        isRefreshing={deliveriesQuery.isFetching || statsQuery.isFetching}
      />

      {statsQuery.data && <DeliveryStats stats={statsQuery.data} />}

      {statsQuery.isError && (
        <div
          role="alert"
          className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800"
        >
          Delivery statistics could not be loaded.
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-slate-900">All deliveries</h2>
            <p className="mt-1 text-sm text-slate-500">
              Search and manage your delivery records.
            </p>
          </div>

          <span className="text-sm text-slate-500">
            {pagination?.count ?? 0} deliveries
          </span>
        </div>

        <DeliveryFilters filters={filters} onChange={setFilters} />

        {actionError && (
          <div
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {actionError}
          </div>
        )}

        {deliveriesQuery.isLoading ? (
          <div className="space-y-3 py-6" aria-busy="true">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-lg bg-slate-100"
              />
            ))}
          </div>
        ) : deliveriesQuery.isError ? (
          <div role="alert" className="py-12 text-center">
            <AlertCircle className="mx-auto text-red-500" size={28} />
            <p className="mt-3 font-semibold text-slate-800">
              Unable to load deliveries
            </p>
            <button
              type="button"
              onClick={() => void deliveriesQuery.refetch()}
              className="mt-3 text-sm font-semibold text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="mt-5 hidden lg:block">
              <DeliveriesTable
                deliveries={deliveries}
                onDelete={handleDelete}
                isDeleting={deleteDelivery.isPending}
              />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
              {deliveries.map((delivery) => (
                <DeliveryCard key={delivery.id} delivery={delivery} />
              ))}
              {deliveries.length === 0 && (
                <p className="col-span-full py-10 text-center text-sm text-slate-500">
                  No deliveries found.
                </p>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-500">
                Page {pagination?.page ?? 1} of {pagination?.totalPages ?? 1}
                {" · "}
                {pagination?.count ?? 0} results
              </p>

              <div className="flex items-center gap-2">
                <label className="sr-only" htmlFor="delivery-page-size">
                  Results per page
                </label>
                <select
                  id="delivery-page-size"
                  value={filters.pageSize}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      pageSize: Number(event.target.value),
                      page: 1,
                    }))
                  }
                  className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>

                <button
                  type="button"
                  disabled={filters.page <= 1}
                  onClick={() =>
                    setFilters((current) => ({
                      ...current,
                      page: current.page - 1,
                    }))
                  }
                  aria-label="Previous page"
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                </button>

                <button
                  type="button"
                  disabled={filters.page >= (pagination?.totalPages ?? 1)}
                  onClick={() =>
                    setFilters((current) => ({
                      ...current,
                      page: current.page + 1,
                    }))
                  }
                  aria-label="Next page"
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      <div className="text-xs text-slate-400">
        <Link to="/orders" className="hover:text-blue-600">
          View orders
        </Link>
      </div>
    </main>
  );
}

export default DeliveriesPage;
