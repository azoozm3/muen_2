import { NurseRequest } from "../../../../models/NurseRequest.js";
import { attachProviderPatientRatings } from "../../helpers/nurseRequestRatings.js";

function buildNurseRequestQuery(currentUser) {
  if (!currentUser) return { _id: null };
  if (currentUser.role === "patient") return { patientId: String(currentUser.id) };
  if (currentUser.role === "nurse") return { $or: [{ nurseId: String(currentUser.id) }, { status: "pending" }] };
  return { _id: null };
}

export async function getVisibleNurseRequests(currentUser) {
  const requests = await NurseRequest.find(buildNurseRequestQuery(currentUser)).sort({ createdAt: -1 }).lean();
  return attachProviderPatientRatings(requests);
}

export async function updateOwnedRequest(requestId, nurseId, updateFn) {
  const request = await NurseRequest.findOne({ _id: requestId, nurseId: String(nurseId) });
  if (!request) throw new Error("ACCESS_DENIED");

  updateFn(request);
  await request.save();

  const [enrichedRequest] = await attachProviderPatientRatings([request.toObject()]);
  return enrichedRequest;
}
