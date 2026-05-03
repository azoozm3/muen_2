import { Card, CardContent } from "@/components/ui/card";

export default function AppointmentsSection({ title, description, emptyText, items, renderItem }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {items.length ? (
        <div className="space-y-4">{items.map(renderItem)}</div>
      ) : (
        <Card className="rounded-2xl">
          <CardContent className="p-6 text-sm text-muted-foreground sm:p-8">{emptyText}</CardContent>
        </Card>
      )}
    </section>
  );
}
