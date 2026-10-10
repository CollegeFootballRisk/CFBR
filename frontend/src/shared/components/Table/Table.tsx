// SPDX-License-Identifier: MPL-2.0

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useAppSettings } from "@/app/useAppSettings";
import { cn } from "@/shared/utils/cn";
import { Button } from "../Button";
import { SettingsIcon } from "../Icons";
import { PageSizeSelect } from "./PageSizeSelect";

export type TableAlign = "left" | "center" | "right";

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  accessor?: keyof T;
  cell?: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number | boolean | null | undefined;

  align?: TableAlign;
  className?: string;
  headerClassName?: string;

  tooltip?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];

  getRowKey?: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;

  loading?: boolean;
  loadingMessage?: ReactNode;
  emptyMessage?: ReactNode;

  initialSortKey?: string;
  initialSortDirection?: "asc" | "desc";

  className?: string;
  tableClassName?: string;
  scrollClassName?: string;
}

const alignClasses: Record<TableAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function compareValues(
  left: string | number | boolean | null | undefined,
  right: string | number | boolean | null | undefined,
): number {
  if (left == null && right == null) {
    return 0;
  }

  if (left == null) {
    return 1;
  }

  if (right == null) {
    return -1;
  }

  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  if (typeof left === "boolean" && typeof right === "boolean") {
    return Number(left) - Number(right);
  }

  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function getSortValue<T>(
  column: TableColumn<T>,
  row: T,
): string | number | boolean | null | undefined {
  if (column.sortValue) {
    return column.sortValue(row);
  }

  if (column.accessor) {
    return row[column.accessor] as string | number | boolean | null | undefined;
  }

  return null;
}

function getDefaultAlign<T>(column: TableColumn<T>, row?: T): TableAlign {
  if (!row) {
    return "center";
  }

  const value = getSortValue(column, row);

  return typeof value === "number" ? "right" : "center";
}

export function Table<T>({
  data,
  columns,
  getRowKey = (_, index) => index,
  onRowClick,
  loading = false,
  loadingMessage = "Loading...",
  emptyMessage = "No data available.",
  initialSortKey,
  initialSortDirection = "asc",
  className,
  tableClassName,
  scrollClassName = "max-h-[70dvh]",
}: TableProps<T>) {
  const { settings, updateSetting } = useAppSettings();

  const [sortKey, setSortKey] = useState(initialSortKey ?? columns[0]?.key);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(initialSortDirection);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPageSize, setShowPageSize] = useState(false);

  const pageSize = settings.pageSize;

  const sortedData = useMemo(() => {
    if (!sortKey) {
      return data;
    }

    const column = columns.find((item) => item.key === sortKey);

    if (!column) {
      return data;
    }

    return [...data].sort((left, right) => {
      const comparison = compareValues(getSortValue(column, left), getSortValue(column, right));

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [columns, data, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;

    return sortedData.slice(start, start + pageSize);
  }, [pageSize, currentPage, sortedData]);

  const handleSort = (column: TableColumn<T>) => {
    if (sortKey === column.key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      setCurrentPage(1);
      return;
    }

    setSortKey(column.key);
    setSortDirection("asc");
    setCurrentPage(1);
  };

  const startItem = sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const endItem = Math.min(currentPage * pageSize, sortedData.length);

  return (
    <div className={cn("w-full space-y-3", className)}>
      <div className="w-full rounded-md border-2 border-dotted border-accent-2 p-2 sm:p-3">
        <div className="sticky left-0 w-full pb-3 text-left">
          {sortKey && (
            <span className="text-sm italic text-info">
              Sorted by: {columns.find((column) => column.key === sortKey)?.header ?? sortKey} (
              {sortDirection === "asc" ? "ascending" : "descending"})
            </span>
          )}
        </div>
        <div className={cn("w-full overflow-auto", scrollClassName)}>
          <table
            className={cn(
              "mx-auto border-separate border-spacing-0 text-sm outline-1 outline-accent-1",
              tableClassName,
            )}
          >
            <thead>
              <tr className="bg-accent-1">
                {columns.map((column) => {
                  const isSorted = sortKey === column.key;
                  const alignment = column.align ?? getDefaultAlign(column, data[0]);

                  return (
                    <th
                      key={column.key}
                      scope="col"
                      aria-sort={
                        isSorted ? (sortDirection === "asc" ? "ascending" : "descending") : "none"
                      }
                      title={column.tooltip}
                      className={cn(
                        "sticky -top-px z-20",
                        "border-b border-control-border border-dotted px-2 py-2 sm:px-3 font-semibold",
                        "border-r border-solid border-control-border last:border-r-0",
                        "bg-accent-1",
                        alignClasses[alignment],
                        isSorted && "bg-accent-2",
                        column.headerClassName,
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => handleSort(column)}
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-1 font-semibold hover:underline",
                          "focus-visible:outline-2 focus-visible:outline-foreground",
                          alignment === "right" && "justify-end",
                          alignment === "center" && "justify-center",
                        )}
                      >
                        <span>{column.header}</span>
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="px-3 py-8 text-center">
                    {loadingMessage}
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-3 py-8 text-center">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr
                    key={getRowKey(row, index)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    onKeyDown={
                      onRowClick
                        ? (event) => {
                            if (
                              (event.key === "Enter" || event.key === " ") &&
                              event.target === event.currentTarget
                            ) {
                              event.preventDefault();
                              onRowClick(row);
                            }
                          }
                        : undefined
                    }
                    tabIndex={onRowClick ? 0 : undefined}
                    aria-label={onRowClick ? "Open row" : undefined}
                    className={cn(
                      "even:bg-table-stripe",
                      onRowClick &&
                        "cursor-pointer hover:bg-control focus-visible:outline-2 focus-visible:outline-foreground",
                    )}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          "border-b border-r border-control-border border-dotted px-3 py-2",
                          "last:border-r-0",
                          alignClasses[column.align ?? getDefaultAlign(column, row)],
                          sortKey === column.key &&
                            "bg-accent-1 [&_a]:underline [&_a]:text-foreground [&_a:hover]:text-lg",
                          column.className,
                        )}
                      >
                        {column.cell
                          ? column.cell(row)
                          : column.accessor
                            ? String(row[column.accessor] ?? "")
                            : null}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {sortedData.length > 0 && (
          <div className="sticky left-0 flex items-center justify-between gap-3 pt-2 text-sm">
            {showPageSize ? (
              <div className="flex items-center gap-2">
                <PageSizeSelect
                  value={pageSize}
                  onChange={(value) => {
                    updateSetting("pageSize", value);
                    setCurrentPage(1);
                    setShowPageSize(false);
                  }}
                />
                <span className="text-info">rows/page</span>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setShowPageSize(true)}
                  className="flex items-center gap-1 hover:bg-control focus-visible:outline-2 focus-visible:outline-foreground"
                  aria-label="Change rows displayed per page"
                  title="Click to change # of rows displayed per page"
                >
                  <SettingsIcon />

                  <span className="text-info font-bold">
                    {startItem}-{endItem}/{sortedData.length}
                  </span>
                </button>

                <nav aria-label="Table pagination" className="flex">
                  <Button
                    variant="pagination"
                    rounded="left"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    aria-label="First page"
                    title="First Page"
                  >
                    «
                  </Button>

                  <Button
                    variant="pagination"
                    rounded="none"
                    className="border-l border-accent-2"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    title="Previous Page"
                  >
                    ←
                  </Button>

                  <Button
                    variant="pagination"
                    rounded="none"
                    className="border-l border-accent-2"
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    title="Next Page"
                  >
                    →
                  </Button>

                  <Button
                    variant="pagination"
                    rounded="right"
                    className="border-l border-accent-2"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="Last page"
                    title="Last Page"
                  >
                    »
                  </Button>
                </nav>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
