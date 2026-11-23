import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProcurementStats } from "../components/ProcurementStats";
import { ProcurementFilters } from "../components/ProcurementFilters";
import { ProcurementTable } from "../components/ProcurementTable";
import { ProcurementCard } from "../components/ProcurementCard";
import { useProcurement } from "../hooks/useProcurement";
import type { ProcurementFilters as Filters } from "../types/procurement.types";

export function ProcurementPage() {
  const [filters, setFilters] = useState<Filters>({});
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, refetch, isFetching } = useProcurement(
    filters,
    page,
    pageSize,
  );

  const requests = data?.results ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.count ?? 0) / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Procurement</h1>
          <p className="text-muted-foreground">
            Manage purchasing requests and procurement activities.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
          <Button asChild>
            <Link to="/procurement/new">
              <Plus className="mr-2 h-4 w-4" />
              New request
            </Link>
          </Button>
        </div>
      </div>

      <ProcurementStats />

      <div className="space-y-4">
        <ProcurementFilters
          filters={filters}
          onChange={(nextFilters) => {
            setFilters(nextFilters);
            setPage(1);
          }}
        />

        {isLoading ? (
          <div className="rounded-lg border p-10 text-center text-muted-foreground">
            Loading procurement requests...
          </div>
        ) : isError ? (
          <div className="rounded-lg border p-10 text-center text-destructive">
            Could not load procurement requests.
            <div className="mt-3">
              <Button variant="outline" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="table" className="space-y-4">
            <div className="flex justify-end">
              <TabsList>
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="cards">Cards</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="table">
              <ProcurementTable requests={requests} />
            </TabsContent>

            <TabsContent value="cards">
              {requests.length ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {requests.map((request) => (
                    <ProcurementCard key={request.id} request={request} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border p-10 text-center text-muted-foreground">
                  No procurement requests found.
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {!isLoading && !isError && data?.count ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, data.count)} of {data.count} requests
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
        ) : null}
      </div>
    </div>
  );
}
