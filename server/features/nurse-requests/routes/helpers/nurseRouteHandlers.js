import storage from "../../../../storage/index.js";
import { assignNurse, cancelRequest, savePatientRating, updateOwnedRequest } from "../nurseRouteUtils.js";

export async function handleNurseRespond(req, action) {
  const nurse = await storage.getUserById(req.currentUser.id);
  return assignNurse(req.params.id, nurse || req.currentUser, action === "accepted" ? "accept" : "decline");
}

export async function handleNurseReassign(req) {
  return updateOwnedRequest(req.params.id, req.currentUser.id, (doc) => {
    doc.status = "reassigned";
    doc.nurseId = null;
    doc.nurseName = "";
    doc.nursePhone = "";
  });
}

export async function handleNurseStatus(req, status) {
  return updateOwnedRequest(req.params.id, req.currentUser.id, (doc) => {
    doc.status = status;
    if (status === "accepted" && !doc.acceptedAt) doc.acceptedAt = new Date();
    if (status === "completed") doc.completedAt = new Date();
  });
}

export async function handleNurseReport(req, report) {
  return updateOwnedRequest(req.params.id, req.currentUser.id, (doc) => { doc.visitReport = report || {}; });
}

export async function handleNurseNotes(req, content) {
  return updateOwnedRequest(req.params.id, req.currentUser.id, (doc) => { doc.notes = content || ""; });
}

export async function handlePatientReview(req, rating, feedback) {
  return savePatientRating(req.params.id, req.currentUser.id, { rating, comment: feedback });
}

export async function handleCancel(req) {
  return cancelRequest(req.params.id, req.currentUser);
}
