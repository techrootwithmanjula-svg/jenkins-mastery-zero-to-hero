import React from "react";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableSectionProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  isHeader?: boolean;

  // ADD THESE
  colSpan?: number;
  rowSpan?: number;
}

export const Table: React.FC<
  TableProps
> = ({
  children,
  className = "",
}) => {
  return (
    <table
      className={`w-full ${className}`}
    >
      {children}
    </table>
  );
};

export const TableHeader: React.FC<
  TableSectionProps
> = ({
  children,
  className = "",
}) => {
  return (
    <thead className={className}>
      {children}
    </thead>
  );
};

export const TableBody: React.FC<
  TableSectionProps
> = ({
  children,
  className = "",
}) => {
  return (
    <tbody className={className}>
      {children}
    </tbody>
  );
};

export const TableRow: React.FC<
  TableRowProps
> = ({
  children,
  className = "",
}) => {
  return (
    <tr className={className}>
      {children}
    </tr>
  );
};

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  isHeader?: boolean;
  colSpan?: number;
  rowSpan?: number;
}

export const TableCell: React.FC<
  TableCellProps
> = ({
  children,
  className = "",
  isHeader = false,
  colSpan,
  rowSpan,
}) => {
  const Component =
    isHeader
      ? "th"
      : "td";

  return (
    <Component
      className={className}
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      {children}
    </Component>
  );
};