import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Button from "../../ui/button/Button";

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableAction<T> {
  label: string;
  variant?: "primary" | "outline";
  onClick: (row: T) => void;
  hidden?: (row: T) => boolean;
}

interface DynamicTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  actions?: TableAction<T>[];

  // ✅ server pagination support
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;

  emptyMessage?: string;
}

export default function DynamicTable<T extends Record<string, any>>({
  columns,
  data,
  actions = [],
  loading = false,
  currentPage,
  totalPages,
  onPageChange,
  emptyMessage = "No data found",
}: DynamicTableProps<T>) {
  return (
    <div className="min-w-0 w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

      {/* TABLE */}
      <div className="w-full overflow-x-auto">
        <Table className="min-w-max">

          {/* HEADER */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  isHeader
                  className={`px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400 ${column.className || ""}`}
                >
                  {column.header}
                </TableCell>
              ))}

              {actions.length > 0 && (
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">

            {/* LOADING */}
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions.length ? 1 : 0)}
                  className="py-10 text-center text-gray-500"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>

                  {/* COLUMNS */}
                  {columns.map((column, colIndex) => {
                    const value = row[column.key as keyof T];

                    return (
                      <TableCell
                        key={colIndex}
                        className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400"
                      >
                        {column.render
                          ? column.render(value, row)
                          : String(value ?? "")}
                      </TableCell>
                    );
                  })}

                  {/* ACTIONS */}
                  {actions.length > 0 && (
                    <TableCell className="px-5 py-4">
                      <div className="flex gap-2">
                        {actions.map((action, index) =>
                          !action.hidden?.(row) ? (
                            <Button
                              key={index}
                              size="sm"
                              variant={action.variant || "outline"}
                              onClick={() => action.onClick(row)}
                            >
                              {action.label}
                            </Button>
                          ) : null
                        )}
                      </div>
                    </TableCell>
                  )}

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions.length ? 1 : 0)}
                  className="py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}

          </TableBody>
        </Table>
      </div>

      {/* PAGINATION (CONTROLLED FROM PARENT) */}
      {totalPages !== undefined && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4 dark:border-white/[0.05]">

          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => onPageChange?.((currentPage || 1) - 1)}
            >
              Previous
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange?.((currentPage || 1) + 1)}
            >
              Next
            </Button>
          </div>

        </div>
      )}

    </div>
  );
}