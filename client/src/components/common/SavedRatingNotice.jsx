import { CheckCircle2, Star } from "lucide-react";

export function SavedRatingNotice({ title = "Rating saved successfully", rating, feedback = "", className = "" }) {
  return (
    <div className={`rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-800 ${className}`.trim()}>
      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
        <CheckCircle2 className="h-4 w-4" />
        <span>{title}</span>
        {rating ? (
          <span className="inline-flex items-center gap-1">
            {rating}
            <Star className="h-4 w-4 fill-current" />
          </span>
        ) : null}
      </div>
      {feedback ? <p className="mt-2 text-sm text-emerald-700/90">{feedback}</p> : null}
    </div>
  );
}
