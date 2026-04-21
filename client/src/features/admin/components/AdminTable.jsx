import { useMemo, useState } from "react";
import { AdminTableMobileRow } from "./admin-table/AdminTableMobileRow";
import { AdminTableToolbar } from "./admin-table/AdminTableToolbar";
import { getCellValue, makeOptions, normalizeFilterValue, normalizeValue } from "./admin-table/utils";

const DEFAULT_FILTER_FIELDS = [{ key: "status", label: "All status" }];

export function AdminTable({ columns, rows, emptyText = "No data.", searchPlaceholder = "Search table", filterFields = DEFAULT_FILTER_FIELDS }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});

  const activeFilterFields = useMemo(
    () => filterFields.map((field) => ({ ...field, options: makeOptions(rows, field) })).filter((field) => field.options.length > 0),
    [filterFields, rows],
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      for (const field of activeFilterFields) {
        const selectedValue = filters[field.key] || "all";
        if (selectedValue === "all") continue;
        const accessor = typeof field.getValue === "function" ? field.getValue : (item) => item?.[field.key];
        if (normalizeFilterValue(accessor(row)) !== selectedValue) return false;
      }
      return !query || normalizeValue(row).includes(query);
    });
  }, [activeFilterFields, filters, rows, search]);

  return (
    <div className="space-y-4">
      {rows.length > 0 ? (
        <AdminTableToolbar
          search={search}
          setSearch={setSearch}
          searchPlaceholder={searchPlaceholder}
          activeFilterFields={activeFilterFields}
          filters={filters}
          setFilters={setFilters}
          filteredCount={filteredRows.length}
          totalCount={rows.length}
        />
      ) : null}

      {!filteredRows.length ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">{rows.length ? "No matching results." : emptyText}</div>
      ) : (
        <>
          <div className="space-y-3 md:hidden">{filteredRows.map((row, index) => <AdminTableMobileRow key={row.id || row._id || index} columns={columns} row={row} />)}</div>

          <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-card shadow-sm md:block">
            <table className="min-w-full border-separate border-spacing-0">
              <thead className="bg-slate-100/90">
                <tr>{columns.map((column) => <th key={column.key} className="border-b border-slate-200 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">{column.label}</th>)}</tr>
              </thead>
              <tbody className="bg-card">
                {filteredRows.map((row, index) => (
                  <tr key={row.id || row._id || index} className="transition-colors hover:bg-slate-50">
                    {columns.map((column) => <td key={column.key} className="border-b border-slate-200 px-4 py-3 align-top text-sm leading-6 text-slate-900 last:border-b-0"><div className="min-w-0 break-words">{getCellValue(column, row)}</div></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
