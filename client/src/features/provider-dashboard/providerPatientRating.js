import { queryClient } from "@/lib/queryClient";

export function buildProviderPatientRatingBody({ patientId, interactionType, interactionId, rating, feedback = "" }) {
  return { patientId, interactionType, interactionId, rating, feedback };
}

export async function saveProviderPatientRating({ queryKey, ...payload }) {
  const response = await fetch("/api/patient-ratings", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildProviderPatientRatingBody(payload)),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Failed to save patient rating");

  if (queryKey) await queryClient.invalidateQueries({ queryKey });
  return data;
}
