import { apiRequest, queryClient, readJsonResponse } from "@/lib/queryClient";

export function buildProviderPatientRatingBody({ patientId, interactionType, interactionId, rating, feedback = "" }) {
  return { patientId, interactionType, interactionId, rating, feedback };
}

export async function saveProviderPatientRating({ queryKey, ...payload }) {
  const response = await apiRequest("POST", "/api/patient-ratings", buildProviderPatientRatingBody(payload));
  const data = await readJsonResponse(response, "Failed to save patient rating");

  if (queryKey) await queryClient.invalidateQueries({ queryKey });
  return data;
}
