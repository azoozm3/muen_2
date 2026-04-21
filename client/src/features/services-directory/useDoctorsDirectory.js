import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/queryClient";

export function useDoctorsDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [minRating, setMinRating] = useState("0");
  const [onlineOnly, setOnlineOnly] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedSpecialty !== "all") params.set("specialty", selectedSpecialty);
    if (searchQuery) params.set("search", searchQuery);
    if (Number(minRating) > 0) params.set("minRating", minRating);
    if (onlineOnly === "online") params.set("onlineConsultation", "true");
    return params.toString();
  }, [minRating, onlineOnly, searchQuery, selectedSpecialty]);

  const doctorsQuery = useQuery({
    queryKey: ["/api/doctors", selectedSpecialty, searchQuery, minRating, onlineOnly],
    queryFn: () => fetchJson(`/api/doctors?${queryString}`, "Failed to fetch doctors"),
    staleTime: 10000,
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("all");
    setMinRating("0");
    setOnlineOnly("all");
  };

  return {
    doctorsQuery,
    filters: { searchQuery, setSearchQuery, selectedSpecialty, setSelectedSpecialty, minRating, setMinRating, onlineOnly, setOnlineOnly },
    selectedDoctor,
    setSelectedDoctor,
    hasActiveFilters: Boolean(searchQuery) || selectedSpecialty !== "all" || Number(minRating) > 0 || onlineOnly !== "all",
    clearFilters,
  };
}
