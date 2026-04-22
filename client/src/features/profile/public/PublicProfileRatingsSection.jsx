import { MessageSquare, Star } from "lucide-react";

export default function PublicProfileRatingsSection({
  ratings = [],
  title = "Ratings",
  emptyText = "No ratings yet.",
}) {
  return (
    <div className="mt-6 rounded-2xl border p-4 sm:p-5">
      <div className="flex items-center gap-2 font-semibold">
        <MessageSquare className="h-4 w-4" />
        {title}
      </div>
      {!ratings.length ? (
        <p className="mt-3 text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="mt-3 space-y-3">
          {ratings.map((item, index) => (
            <div key={item._id || item.id || index} className="rounded-2xl bg-muted p-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium">{item.patientName || item.providerName || item.providerRole || "Patient"}</div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold text-foreground">{item.rating}</span>
                </div>
              </div>
              {item.comment || item.feedback ? <div className="mt-2 text-muted-foreground">{item.comment || item.feedback}</div> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
