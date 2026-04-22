import { requireAuth, sendZodError } from "../../../routes/helpers.js";
import { noteSchema, patientRatingSchema, respondSchema, statusSchema, visitReportSchema, serializeNurseRequest } from "./nurseRouteUtils.js";
import { handleCancel, handleNurseNotes, handleNurseReassign, handleNurseReport, handleNurseRespond, handleNurseStatus, handlePatientReview } from "./helpers/nurseRouteHandlers.js";
import { sendNurseRouteError, withSerializedResponse } from "./helpers/nurseRouteResponses.js";

function requireRole(res, currentUser, role, message) {
  if (currentUser.role !== role) {
    res.status(403).json({ message });
    return false;
  }
  return true;
}

export function registerNurseActionRoutes(app) {
  app.patch("/api/nurse-requests/:id/respond", requireAuth, async (req, res) => {
    if (!requireRole(res, req.currentUser, "nurse", "Only nurses can respond to requests")) return;
    const parsed = respondSchema.safeParse(req.body || {});
    if (!parsed.success) return sendZodError(res, parsed.error);

    try {
      return withSerializedResponse(res, await handleNurseRespond(req, parsed.data.action), serializeNurseRequest);
    } catch (error) {
      return sendNurseRouteError(res, error, { logLabel: "PATCH /api/nurse-requests/:id/respond error:", fallbackMessage: "Failed to respond to nurse request", known: { NOT_FOUND: { status: 404, message: "Nurse request not found" }, ALREADY_HANDLED: { status: 400, message: "This request has already been handled" } } });
    }
  });

  app.patch("/api/nurse-requests/:id/reassign", requireAuth, async (req, res) => {
    if (!requireRole(res, req.currentUser, "nurse", "Only nurses can request reassignment")) return;
    try {
      return withSerializedResponse(res, await handleNurseReassign(req), serializeNurseRequest);
    } catch (error) {
      return sendNurseRouteError(res, error, { logLabel: "PATCH /api/nurse-requests/:id/reassign error:", fallbackMessage: "Failed to reassign nurse request", known: { NOT_FOUND: { status: 404, message: "Nurse request not found" }, ACCESS_DENIED: { status: 403, message: "Access denied" } } });
    }
  });

  app.patch("/api/nurse-requests/:id/cancel", requireAuth, async (req, res) => {
    try {
      return withSerializedResponse(res, await handleCancel(req), serializeNurseRequest);
    } catch (error) {
      return sendNurseRouteError(res, error, { logLabel: "PATCH /api/nurse-requests/:id/cancel error:", fallbackMessage: "Failed to cancel nurse request", known: { NOT_FOUND: { status: 404, message: "Nurse request not found" }, ACCESS_DENIED: { status: 403, message: "Access denied" }, CANNOT_CANCEL: { status: 400, message: "This request cannot be cancelled" } } });
    }
  });

  app.patch("/api/nurse-requests/:id/status", requireAuth, async (req, res) => {
    if (!requireRole(res, req.currentUser, "nurse", "Only nurses can update request status")) return;
    const parsed = statusSchema.safeParse(req.body || {});
    if (!parsed.success) return sendZodError(res, parsed.error);

    try {
      return withSerializedResponse(res, await handleNurseStatus(req, parsed.data.status), serializeNurseRequest);
    } catch (error) {
      return sendNurseRouteError(res, error, { logLabel: "PATCH /api/nurse-requests/:id/status error:", fallbackMessage: "Failed to update nurse request status", known: { NOT_FOUND: { status: 404, message: "Nurse request not found" }, ACCESS_DENIED: { status: 403, message: "Access denied" } } });
    }
  });

  app.patch("/api/nurse-requests/:id/report", requireAuth, async (req, res) => {
    if (!requireRole(res, req.currentUser, "nurse", "Only nurses can update reports")) return;
    const parsed = visitReportSchema.safeParse(req.body || {});
    if (!parsed.success) return sendZodError(res, parsed.error);

    try {
      return withSerializedResponse(res, await handleNurseReport(req, parsed.data), serializeNurseRequest);
    } catch (error) {
      return sendNurseRouteError(res, error, { logLabel: "PATCH /api/nurse-requests/:id/report error:", fallbackMessage: "Failed to save nurse report", known: { NOT_FOUND: { status: 404, message: "Nurse request not found" }, ACCESS_DENIED: { status: 403, message: "Access denied" } } });
    }
  });

  app.patch("/api/nurse-requests/:id/notes", requireAuth, async (req, res) => {
    if (!requireRole(res, req.currentUser, "nurse", "Only nurses can update notes")) return;
    const parsed = noteSchema.safeParse(req.body || {});
    if (!parsed.success) return sendZodError(res, parsed.error);

    try {
      return withSerializedResponse(res, await handleNurseNotes(req, parsed.data.content), serializeNurseRequest);
    } catch (error) {
      return sendNurseRouteError(res, error, { logLabel: "PATCH /api/nurse-requests/:id/notes error:", fallbackMessage: "Failed to save nurse notes", known: { NOT_FOUND: { status: 404, message: "Nurse request not found" }, ACCESS_DENIED: { status: 403, message: "Access denied" } } });
    }
  });

  app.post("/api/nurse-requests/:id/review", requireAuth, async (req, res) => {
    if (!requireRole(res, req.currentUser, "patient", "Only patients can submit ratings")) return;
    const parsed = patientRatingSchema.safeParse(req.body || {});
    if (!parsed.success) return sendZodError(res, parsed.error);

    try {
      return withSerializedResponse(res, await handlePatientReview(req, parsed.data.rating, parsed.data.feedback), serializeNurseRequest);
    } catch (error) {
      return sendNurseRouteError(res, error, { logLabel: "POST /api/nurse-requests/:id/review error:", fallbackMessage: "Failed to save review", known: { NOT_FOUND: { status: 404, message: "Nurse request not found" }, ACCESS_DENIED: { status: 403, message: "Access denied" }, NOT_READY: { status: 400, message: "Rating is allowed only after completion" } } });
    }
  });
}
