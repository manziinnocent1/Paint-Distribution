import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingFilters, PricingStats, PricingTable } from "../components";
import { usePricing } from "../hooks/usePricing";
import type { PricingFilters as Filters } from "../types/pricing.types";

export function PricingPage() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    priceType: "all",
    status: "all",
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, refetch } = usePricing(
    filters,
    page,
    pageSize,
  );

  const totalPages = Math.max(1, Math.ceil((data?.count ?? 0) / pageSize));

  function handleFilters(nextFilters: Filters) {
    setFilters(nextFilters);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Pricing management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage product prices, price types, and pricing adjustments.
          </p>
        </div>

        <Button asChild>
          <Link to="/pricing/new">
            <Plus className="mr-2 h-4 w-4" />
            Create price
          </Link>
        </Button>
      </div>

      <PricingStats />

      <div className="space-y-4">
        <PricingFilters filters={filters} onChange={handleFilters} />

        {isLoading ? (
          <div className="rounded-md border p-10 text-center text-sm text-muted-foreground">
            Loading pricing records...
          </div>
        ) : isError ? (
          <div className="rounded-md border p-10 text-center">
            <p className="text-sm text-destructive">
              Unable to load pricing records.
            </p>
            <Button
              className="mt-3"
              variant="outline"
              onClick={() => refetch()}
            >
              Try again
            </Button>
          </div>
        ) : (
          <>
            <PricingTable prices={data?.results ?? []} />

            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-sm text-muted-foreground">
                Showing {data?.results.length ?? 0} of {data?.count ?? 0}{" "}
                pricing records
              </p>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Previous
                </Button>
                <span className="px-2 text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
