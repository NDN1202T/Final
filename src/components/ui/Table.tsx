import React from 'react';
import { cn } from '../../utils/helpers';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <div className="overflow-x-auto">
      <table className={cn("min-w-full divide-y divide-gray-200 dark:divide-gray-700", className)}>
        {children}
      </table>
    </div>
  );
};

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHead: React.FC<TableHeadProps> = ({ children, className }) => {
  return (
    <thead className={cn("bg-gray-50 dark:bg-gray-700", className)}>
      {children}
    </thead>
  );
};

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return (
    <tbody className={cn("bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700", className)}>
      {children}
    </tbody>
  );
};

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({ children, className, onClick }) => {
  return (
    <tr 
      className={cn(
        onClick && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export const TableCell: React.FC<TableCellProps> = ({ children, className }) => {
  return (
    <td className={cn("px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", className)}>
      {children}
    </td>
  );
};

interface TableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHeaderCell: React.FC<TableHeaderCellProps> = ({ children, className }) => {
  return (
    <th 
      scope="col" 
      className={cn(
        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400",
        className
      )}
    >
      {children}
    </th>
  );
};