import { Star } from "lucide-react";

export default function PublicProfileHeader({
  data,
  profileLabel = "Provider Profile",
  ratingText = "Provider rating",
  ratingValue = null,
  ratingCount = 0,
  nameFallback = "Profile",
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{profileLabel}</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{data?.name || nameFallback}</h1>
      </div>
      <div className="rounded-2xl bg-primary/5 px-4 py-3 text-center">
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="h-4 w-4 fill-current" />
          <span className="font-semibold text-foreground">{ratingValue ?? "New"}</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{ratingText}{ratingCount ? ` · ${ratingCount}` : ""}</p>
      </div>
    </div>
  );
}
