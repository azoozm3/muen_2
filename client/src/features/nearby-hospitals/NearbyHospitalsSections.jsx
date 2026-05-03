import { ExternalLink, Hospital, Loader2, LocateFixed, MapPin, Navigation, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buildDirectionsUrl, buildMapsSearchUrl } from "./hospitalUtils";

export function MapCard({ mapHtml, isRefreshing, onRefresh }) {
  return (
    <Card className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">Map</h2>
          <p className="text-sm text-muted-foreground">Your location and the nearest hospitals are shown below.</p>
        </div>
        <Button type="button" variant="outline" onClick={onRefresh} disabled={isRefreshing}>
          {isRefreshing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Refreshing</> : <><RefreshCw className="mr-2 h-4 w-4" /> Refresh location</>}
        </Button>
      </div>
      <iframe title="Nearby hospitals map" srcDoc={mapHtml} className="h-[380px] w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </Card>
  );
}

export function HospitalListCard({ locationState, loadingHospitals, hospitalsError, hospitals, userLocation }) {
  return (
    <Card className="rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2"><Hospital className="h-5 w-5 text-primary" /><h2 className="font-semibold">Closest hospitals</h2></div>

      {locationState.loading ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Detecting your location...</div> : null}
      {!locationState.loading && locationState.error ? <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{locationState.error}</div> : null}
      {!locationState.loading && !locationState.error && loadingHospitals ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Searching nearby hospitals...</div> : null}
      {!loadingHospitals && hospitalsError ? <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{hospitalsError}</div> : null}
      {!loadingHospitals && !hospitalsError && hospitals.length === 0 && userLocation ? <div className="rounded-xl border bg-slate-50 p-4 text-sm text-muted-foreground">No nearby hospitals were found for this area yet.</div> : null}

      <div className="space-y-3">
        {hospitals.map((hospital, index) => (
          <div key={hospital.id} className={`rounded-xl border p-4 ${index === 0 ? "border-primary/30 bg-primary/5" : ""}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2"><p className="font-semibold">{hospital.name}</p>{index === 0 ? <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Nearest</span> : null}</div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {hospital.street || "Address not available"}</p>
                  <p className="flex items-center gap-2"><Navigation className="h-4 w-4" /> {hospital.distanceText} away</p>
                </div>
              </div>

              {userLocation ? (
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline"><a href={buildMapsSearchUrl(hospital.latitude, hospital.longitude, hospital.name)} target="_blank" rel="noreferrer"><ExternalLink className="mr-2 h-4 w-4" /> Open</a></Button>
                  <Button asChild size="sm"><a href={buildDirectionsUrl(userLocation.latitude, userLocation.longitude, hospital.latitude, hospital.longitude)} target="_blank" rel="noreferrer"><Navigation className="mr-2 h-4 w-4" /> Directions</a></Button>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function HospitalSummaryCard({ userLocation, nearestHospital }) {
  return (
    <Card className="rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2"><LocateFixed className="h-5 w-5 text-primary" /><h2 className="font-semibold">Quick summary</h2></div>
      <div className="space-y-4 text-sm">
        <div className="rounded-xl bg-slate-50 p-4"><p className="mb-1 text-muted-foreground">Your coordinates</p><p className="font-medium">{userLocation ? `${userLocation.latitude.toFixed(5)}, ${userLocation.longitude.toFixed(5)}` : "Waiting for location..."}</p></div>
        <div className="rounded-xl bg-slate-50 p-4"><p className="mb-1 text-muted-foreground">Nearest hospital</p><p className="font-medium">{nearestHospital ? nearestHospital.name : "Searching..."}</p><p className="mt-1 text-muted-foreground">{nearestHospital ? `${nearestHospital.distanceText} from your location` : "The nearest result will appear here once loading finishes."}</p></div>

      </div>
    </Card>
  );
}
