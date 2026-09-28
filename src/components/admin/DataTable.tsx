'use client';

import React from 'react';

interface Column {
  key: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (item: any) => React.ReactNode;
  className?: string;
}

interface DataTableProps {
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  keyField: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowClick?: (item: any) => void;
  emptyMessage?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export default function DataTable({
  columns,
  data,
  keyField,
  onRowClick,
  emptyMessage = 'No data found',
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
}: DataTableProps) {
  return (
    <div className="bg-white border border-[#E5E2D9] rounded-md overflow-hidden shadow-xs">
      {/* Search bar */}
      {onSearchChange && (
        <div className="p-4 border-b border-[#E5E2D9]">
          <input
            type="text"
            value={searchValue || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full max-w-sm bg-[#FAF9F5] border border-[#E5E2D9] px-3.5 py-2 text-xs rounded-md outline-none focus:border-[#070F18] transition-colors"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#FAF9F5] border-b border-[#E5E2D9]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left px-4 py-3 font-bold text-[10px] tracking-[0.16em] uppercase text-[#64748B] ${col.className || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-[#94A3B8] text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={String(item[keyField])}
                  onClick={() => onRowClick?.(item)}
                  className={`border-b border-[#E5E2D9] last:border-b-0 hover:bg-[#FAF9F5] transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3.5 ${col.className || ''}`}>
                      {col.render
                        ? col.render(item)
                        : String(item[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
