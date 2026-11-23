import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, Plus, RefreshCw, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesStats } from "../components/SalesStats";
import { SalesFilters } from "../components/SalesFilters";
import { SalesTable } from "../components/SalesTable";
import { SalesCard } from "../components/SalesCard";
import { useSales } from "../hooks/useSales";
import type { SalesFilters as Filters } from "../types/sales.types";

export function SalesPage() {
  const [filters, setFilters] = useState<Filters>({});
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, isFetching, refetch } = useSales(
    filters,
    page,
    pageSize,
  );

  const sales = data?.results ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales</h1>
          <p className="text-muted-foreground">
            Manage customer sales, orders, and payment balances.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refresh sales"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
          <Button asChild>
            <Link to="/sales/new">
              <Plus className="mr-2 h-4 w-4" />
              Create sale
            </Link>
          </Button>
        </div>
      </div>

      <SalesStats />

      <SalesFilters
        filters={filters}
        onChange={(nextFilters) => {
          setFilters(nextFilters);
          setPage(1);
        }}
      />

      {isLoading ? (
        <div className="rounded-lg border p-10 text-center text-muted-foreground">
          Loading sales...
        </div>
      ) : isError ? (
        <div className="space-y-3 rounded-lg border p-10 text-center">
          <p className="text-destructive">Unable to load sales.</p>
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <>
          <Tabs defaultValue="table" className="space-y-4">
            <div className="flex justify-end">
              <TabsList>
                <TabsTrigger value="table">
                  <Table2 className="mr-2 h-4 w-4" />
                  Table
                </TabsTrigger>
                <TabsTrigger value="cards">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Cards
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="table">
              <SalesTable sales={sales} />
            </TabsContent>

            <TabsContent value="cards">
              {sales.length ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {sales.map((sale) => (
                    <SalesCard key={sale.id} sale={sale} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border p-10 text-center text-muted-foreground">
                  No sales found.
                </div>
              )}
            </TabsContent>
          </Tabs>

          {count > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, count)} of {count} sales
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
          )}
        </>
      )}
    </div>
  );
}
