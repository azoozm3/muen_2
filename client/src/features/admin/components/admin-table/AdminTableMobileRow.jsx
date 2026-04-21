import { getCellValue } from "./utils";

export function AdminTableMobileRow({ columns, row }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-card p-4 shadow-sm">
      <div className="space-y-3">
        {columns.map((column) => {
          const content = getCellValue(column, row);
          if (content === null || typeof content === "undefined" || content === "") return null;
          const isActions = column.key === "actions";

          return (
            <div key={column.key} className={isActions ? "border-t border-slate-200 pt-3" : "grid grid-cols-[88px_minmax(0,1fr)] gap-3"}>
              {!isActions ? <div className="pt-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{column.label}</div> : null}
              <div className={`min-w-0 break-words text-sm text-slate-900 ${isActions ? "" : "leading-6"}`.trim()}>{content}</div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
