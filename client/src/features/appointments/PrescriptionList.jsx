import { Card } from "@/components/ui/card";

export default function PrescriptionList({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <Card key={item._id || `${item.medicineName}-${index}`} className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h4 className="font-semibold">{item.medicineName}</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Dosage: {item.dosage} • Frequency: {item.frequency} • Duration: {item.duration}
              </p>
              {item.notes ? <p className="mt-2 text-sm">Notes: {item.notes}</p> : null}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
