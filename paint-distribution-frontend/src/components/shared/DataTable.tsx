import * as React from "react";
import { Table, type TableColumn, Card } from "@/components/ui";
import { SearchBar } from "./SearchBar";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { Pagination } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface DataTableProps<T> {
  title?: string;
  description?: string;
  columns: TableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => React.Key;

  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;

  searchable?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;

  emptyTitle?: string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;

  toolbar?: React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  title,
  description,
  columns,
  data,
  getRowKey,
  loading = false,
  error = null,
  onRetry,
  searchable = false,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search records...",
  currentPage = 1,
  totalPages = 1,
  totalItems,
  pageSize = 10,
  onPageChange,
  emptyTitle = "No records found",
  emptyMessage = "There are currently no records to display.",
  onRowClick,
  toolbar,
  className,
}: DataTableProps<T>) {
  return (
    <Card padding="none" className={cn("overflow-hidden", className)}>
      {(title || description || searchable || toolbar) && (
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            )}

            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {searchable && (
              <SearchBar
                value={searchValue}
                onChange={(value) => onSearchChange?.(value)}
                placeholder={searchPlaceholder}
                className="w-full sm:w-64"
              />
            )}

            {toolbar}
          </div>
        </div>
      )}

      <div className="min-h-40">
        {error ? (
          <div className="p-5">
            <ErrorState
              title="Unable to load records"
              message={error}
              onRetry={onRetry}
            />
          </div>
        ) : loading ? (
          <LoadingState message="Loading records..." />
        ) : data.length === 0 ? (
          <div className="p-5">
            <EmptyState title={emptyTitle} description={emptyMessage} />
          </div>
        ) : (
          <Table
            columns={columns}
            data={data}
            getRowKey={getRowKey}
            onRowClick={onRowClick}
          />
        )}
      </div>

      {!error && totalPages > 1 && onPageChange && (
        <div className="border-t border-gray-100 p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </Card>
  );
}
