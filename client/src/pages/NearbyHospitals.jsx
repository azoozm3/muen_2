import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildMapHtml, fetchNearbyHospitals } from "@/features/nearby-hospitals/hospitalUtils";
import { HospitalListCard, HospitalSummaryCard, MapCard } from "@/features/nearby-hospitals/NearbyHospitalsSections";

export default function NearbyHospitals() {
  const [, navigate] = useLocation();
  const [locationState, setLocationState] = useState({ latitude: null, longitude: null, loading: true, error: "" });
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [hospitalsError, setHospitalsError] = useState("");

  const userLocation = useMemo(() => {
    if (!Number.isFinite(locationState.latitude) || !Number.isFinite(locationState.longitude)) return null;
    return { latitude: locationState.latitude, longitude: locationState.longitude };
  }, [locationState.latitude, locationState.longitude]);

  const locateUser = () => {
    if (!navigator.geolocation) {
      setLocationState({ latitude: null, longitude: null, loading: false, error: "This browser does not support location services." });
      return;
    }

    setLocationState((prev) => ({ ...prev, loading: true, error: "" }));
    navigator.geolocation.getCurrentPosition(
      (position) => setLocationState({ latitude: position.coords.latitude, longitude: position.coords.longitude, loading: false, error: "" }),
      (error) => setLocationState({ latitude: null, longitude: null, loading: false, error: error.code === 1 ? "Location permission was denied." : "Could not detect your location." }),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  useEffect(() => {
    locateUser();
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    let cancelled = false;
    setLoadingHospitals(true);
    setHospitalsError("");

    fetchNearbyHospitals(userLocation.latitude, userLocation.longitude)
      .then((results) => {
        if (!cancelled) setHospitals(results);
      })
      .catch((error) => {
        if (!cancelled) {
          setHospitals([]);
          setHospitalsError(error.message || "Could not load nearby hospitals.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingHospitals(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userLocation]);

  const nearestHospital = hospitals[0] || null;
  const mapHtml = buildMapHtml(userLocation, hospitals);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">


        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <h1 className="text-2xl font-bold sm:text-3xl">Nearest Hospital</h1>
          <p className="text-muted-foreground"> finds the nearest hospitals around you.</p>
        </motion.div>

        <MapCard mapHtml={mapHtml} isRefreshing={locationState.loading} onRefresh={locateUser} />

        <div className="grid gap-4 lg:grid-cols-[1.15fr,0.85fr]">
          <HospitalListCard locationState={locationState} loadingHospitals={loadingHospitals} hospitalsError={hospitalsError} hospitals={hospitals} userLocation={userLocation} />
          <HospitalSummaryCard userLocation={userLocation} nearestHospital={nearestHospital} />
        </div>
      </div>
    </div>
  );
}
