import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function ProfileSectionCard({ icon: Icon, title, children }) {
  return (
    <Card className="p-6">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        {Icon ? <Icon className="h-5 w-5 text-muted-foreground" /> : null}
        {title}
      </h2>
      {children}
    </Card>
  );
}

export function StarRating({ rating, small = false }) {
  const sizeClass = small ? "h-3 w-3" : "h-4 w-4";
  return (
    <div className="mt-1 flex items-center gap-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`${sizeClass} ${Number(rating || 0) >= star ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}`} />
        ))}
      </div>
      {!small ? <span className="text-sm font-medium">{rating ? Number(rating).toFixed(1) : "No ratings yet"}</span> : null}
    </div>
  );
}

export function RatingList({ items, emptyText = "No ratings yet.", nameKey = "patientName", labelKey = "providerRole", commentKey = "comment" }) {
  if (!items.length) {
    return <p className="text-sm text-muted-foreground">{emptyText}</p>;
  }

  return items.map((item, index) => (
    <div key={item.id || item._id || index} className="rounded-lg border p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium capitalize">{item[nameKey] || item[labelKey] || "Provider"}</p>
        <Badge variant="outline">{item.rating}/5</Badge>
      </div>
      {item[commentKey] ? <p className="mt-2 text-sm text-muted-foreground">{item[commentKey]}</p> : null}
    </div>
  ));
}
