import { Card } from "@/components/ui/card";

export default function HealthRecordList({ rows = [], emptyText = "No health record rows added yet." }) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyText}</p>;
  }

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <Card key={row._id || `${row.title}-${index}`} className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold">{row.title || "Untitled record"}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{row.details || "No details"}</p>
            </div>
            <span className="rounded-full border px-3 py-1 text-xs font-medium">{row.recordDate || "No date"}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
