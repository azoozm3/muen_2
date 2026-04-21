import { buildLeafletEmbedHtml, buildOpenUrl, isValidCoord } from "./live-map/helpers";
import { MapHeader } from "./live-map/MapHeader";
import { MapUnavailableCard } from "./live-map/MapUnavailableCard";

export function LiveLocationMap({ latitude, longitude, secondaryLatitude, secondaryLongitude, secondaryLabel = "Responder", title = "Live location", description, height = "h-52", compact = false }) {
  const primaryMarker = isValidCoord(latitude, longitude) ? { latitude: Number(latitude), longitude: Number(longitude), label: "Patient" } : null;
  const secondaryMarker = isValidCoord(secondaryLatitude, secondaryLongitude) ? { latitude: Number(secondaryLatitude), longitude: Number(secondaryLongitude), label: secondaryLabel } : null;

  if (!primaryMarker && !secondaryMarker) {
    return <MapUnavailableCard height={height} compact={compact} />;
  }

  const focusMarker = primaryMarker || secondaryMarker;
  const openUrl = buildOpenUrl(primaryMarker, secondaryMarker);
  const embedHtml = buildLeafletEmbedHtml(focusMarker, primaryMarker && secondaryMarker ? secondaryMarker : null);

  return (
    <div className={`overflow-hidden rounded-xl border bg-white ${compact ? "" : "shadow-sm"}`}>
      <MapHeader title={title} description={description} openUrl={openUrl} />
      <iframe title={title} srcDoc={embedHtml} className={`w-full ${height}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      <div className="flex items-center justify-between bg-slate-50 px-4 py-2 text-xs text-muted-foreground">
        <span>Patient: {primaryMarker ? `${primaryMarker.latitude.toFixed(5)}, ${primaryMarker.longitude.toFixed(5)}` : "Waiting"}</span>
        <span>{secondaryLabel}: {secondaryMarker ? `${secondaryMarker.latitude.toFixed(5)}, ${secondaryMarker.longitude.toFixed(5)}` : "Waiting"}</span>
      </div>
    </div>
  );
}
