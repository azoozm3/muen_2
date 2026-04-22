import { NurseRequest } from "../../../models/NurseRequest.js";
import { attachProviderPatientRatings } from "./nurseRatingAggregators.js";

export async function buildNurseList(userId) {
  const raw = await NurseRequest.find({
    $or: [
      { status: "pending", $or: [{ nurseId: { $exists: false } }, { nurseId: null }, { nurseId: "" }] },
      { nurseId: String(userId) },
      { "reassignmentHistory.nurseId": String(userId) },
    ],
  }).sort({ createdAt: -1 });

  const enriched = await attachProviderPatientRatings(raw);
  return enriched.flatMap((item) => mapVisibleNurseItem(item, userId));
}

function mapVisibleNurseItem(item, userId) {
  const isPendingUnassigned = item.status === "pending" && (!item.nurseId || String(item.nurseId).trim() === "");
  const isCurrentAssignee = String(item.nurseId || "") === String(userId);
  const wasReassignedFromThisNurse = Array.isArray(item.reassignmentHistory) && item.reassignmentHistory.some((entry) => String(entry.nurseId || "") === String(userId));

  if (isPendingUnassigned || isCurrentAssignee) return [item];
  if (!wasReassignedFromThisNurse) return [];

  return [{
    ...item,
    status: "reassigned",
    nurseId: String(userId),
    nurseName: item.reassignmentHistory?.slice(-1)?.[0]?.nurseName || item.nurseName,
    reassignmentMessage: "Changed by patient and reopened for another nurse.",
  }];
}
