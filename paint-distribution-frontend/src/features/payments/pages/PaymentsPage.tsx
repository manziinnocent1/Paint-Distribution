import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentFilters, PaymentStats, PaymentTable } from "../components";
import { usePayments } from "../hooks/usePayments";
import type { PaymentFilters as Filters } from "../types/payment.types";

export function PaymentsPage() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
    method: "all",
    provider: "all",
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, refetch } = usePayments(
    filters,
    page,
    pageSize,
  );

  const totalPages = Math.max(1, Math.ceil((data?.count ?? 0) / pageSize));

  function handleFilterChange(nextFilters: Filters) {
    setFilters(nextFilters);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track customer payment transactions.
          </p>
        </div>

        <Button asChild>
          <Link to="/payments/new">
            <Plus className="mr-2 h-4 w-4" />
            Record payment
          </Link>
        </Button>
      </div>

      <PaymentStats />

      <div className="space-y-4">
        <PaymentFilters filters={filters} onChange={handleFilterChange} />

        {isLoading ? (
          <div className="rounded-md border p-10 text-center text-sm text-muted-foreground">
            Loading payments...
          </div>
        ) : isError ? (
          <div className="rounded-md border p-10 text-center">
            <p className="text-sm text-destructive">Unable to load payments.</p>
            <Button
              variant="outline"
              className="mt-3"
              onClick={() => refetch()}
            >
              Try again
            </Button>
          </div>
        ) : (
          <>
            <PaymentTable payments={data?.results ?? []} />

            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-sm text-muted-foreground">
                Showing {data?.results.length ?? 0} of {data?.count ?? 0}{" "}
                payments
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center px-2 text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
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
