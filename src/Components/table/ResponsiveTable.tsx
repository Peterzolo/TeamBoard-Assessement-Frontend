import React from "react";

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onSort?: (key: string, order: "asc" | "desc") => void;
  currentSort?: string;
  currentSortOrder?: "asc" | "desc";
  onRowClick?: (row: T) => void;
  emptyStateMessage?: string;
  showEmptyState?: boolean;
  minTableWidth?: number;
}

export const ResponsiveTable = <T,>({
  data,
  columns,
  onSort,
  currentSort,
  currentSortOrder,
  onRowClick,
  emptyStateMessage = "No data available",
  showEmptyState = true,
  minTableWidth = 800,
}: ResponsiveTableProps<T>) => {
  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];
  const hasData = safeData.length > 0;

  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  const handleSort = (key: string) => {
    if (!onSort) return;

    const newOrder =
      currentSort === key && currentSortOrder === "asc" ? "desc" : "asc";
    onSort(key, newOrder);
  };

  const getSortIcon = (key: string) => {
    const isSorted = currentSort === key;
    const sortOrder = isSorted ? currentSortOrder : null;

    if (!isSorted) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
        </svg>
      );
    }

    return sortOrder === "asc" ? (
      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  return (
    <div className="w-full border-t border-gray-200">
      <div
        className="w-full overflow-x-auto scrollbar-thin"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <table
          className="w-full border-collapse"
          style={{ minWidth: `${minTableWidth}px` }}
        >
          {/* Table Header */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col) => {
                const isSorted = currentSort === String(col.key);
                const sortable = col.sortable !== false && onSort;

                return (
                  <th
                    key={String(col.key)}
                    className={`
                      px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider
                      sm:px-4 sm:py-3 sm:text-sm
                      ${sortable ? "cursor-pointer hover:bg-gray-100 transition-colors" : ""}
                    `}
                    style={col.width ? { width: col.width, minWidth: col.width } : {}}
                    onClick={() => sortable && handleSort(String(col.key))}
                  >
                    <div className="flex items-center gap-2">
                      <span>{col.label}</span>
                      {sortable && (
                        <span className="flex-shrink-0 text-gray-400">
                          {getSortIcon(String(col.key))}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {hasData ? (
              safeData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`
                    transition-colors
                    ${onRowClick ? "cursor-pointer" : ""}
                    ${rowIndex % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50/50 hover:bg-gray-100"}
                  `}
                  onClick={() => handleRowClick(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="px-3 py-3 text-xs text-gray-900 whitespace-nowrap sm:px-4 sm:py-4 sm:text-sm"
                      style={col.width ? { width: col.width, minWidth: col.width } : {}}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : (row[col.key] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              // Empty state row
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-gray-500 sm:px-6 sm:py-16"
                >
                  {showEmptyState ? (
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                      </div>
                      <p className="text-sm sm:text-base font-medium text-gray-600">
                        {emptyStateMessage}
                      </p>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">
                      {emptyStateMessage}
                    </span>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
