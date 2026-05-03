import { ClipboardList } from "lucide-react";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";

export default function PublicProfileRecordsSection({ records }) {
  return (
    <div className="mt-6 rounded-2xl border p-4 sm:p-5">
      <CollapsibleSection icon={ClipboardList} title="Shared Records">
        {!records.length ? <p className="mt-3 text-sm text-muted-foreground">No shared records yet.</p> : (
          <div className="mt-3 space-y-3">
            {records.map((row, index) => (
              <div key={row?._id || index} className="rounded-2xl bg-muted p-3 text-sm">
                <div className="font-medium">{row?.title || row?.condition || row?.label || "Record"}</div>
                {row?.details || row?.value ? <div className="mt-1 text-muted-foreground">{row.details || row.value}</div> : null}
                {row?.recordDate || row?.date ? <div className="mt-1 text-xs text-muted-foreground">{row.recordDate || row.date}</div> : null}
              </div>
            ))}
          </div>
        )}
      </CollapsibleSection>
    </div>
  );
}
