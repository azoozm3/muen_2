export function AdminTableToolbar({ search, setSearch, searchPlaceholder, activeFilterFields, filters, setFilters, filteredCount, totalCount }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className={`grid gap-3 ${activeFilterFields.length ? "md:grid-cols-2 xl:grid-cols-5" : "md:grid-cols-1"}`}>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={searchPlaceholder} className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none ring-0 transition focus:border-slate-400" />
        {activeFilterFields.map((field) => (
          <select key={field.key} value={filters[field.key] || "all"} onChange={(event) => setFilters((current) => ({ ...current, [field.key]: event.target.value }))} className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none">
            <option value="all">{field.label}</option>
            {field.options.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        ))}
      </div>
      <div className="mt-3 text-xs text-slate-500">Showing <span className="font-semibold text-slate-700">{filteredCount}</span> of {totalCount}</div>
    </div>
  );
}
