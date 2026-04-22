import storage from "../../../../storage/index.js";
import { NurseRequest } from "../../../../models/NurseRequest.js";
import { createNurseRequestNumber } from "../../nurse-request.service.js";
import { consumeCapturedPayment } from "../../../../routes/payment.routes.js";
import { refundCapturedPayment } from "../../../../services/payment-refund.service.js";

export async function createRequestFromBody(req, body) {
  const patient = await storage.getUserById(req.currentUser.id);
  const capturedPayment = consumeCapturedPayment(req, body.paymentOrderId, "nurseRequest");
  const identifiers = await createNurseRequestNumber();

  return NurseRequest.create({
    ...identifiers,
    patientId: req.currentUser.id,
    patientName: body.patientName || patient?.name || req.currentUser.name || "Patient",
    patientPhone: body.patientPhone || patient?.phone || "",
    address: body.address || body.location || "",
    requestedDate: body.requestedDate,
    requestedTime: body.requestedTime,
    location: body.location || body.address || "",
    locationNote: body.locationNote || "",
    locationLat: body.locationLat || body.latitude || "",
    locationLng: body.locationLng || body.longitude || "",
    serviceType: body.serviceType || "home_nursing",
    note: body.note || "",
    notes: body.notes || body.note || "",
    amount: capturedPayment?.payment?.grossAmount ?? body.amount ?? 0,
    currency: capturedPayment?.payment?.currency ?? body.currency ?? "USD",
    paymentOrderId: body.paymentOrderId || "",
    paymentCaptureId: capturedPayment?.payment?.paymentRef || "",
  });
}

export async function assignNurse(requestId, nurseUser, action) {
  const doc = await NurseRequest.findById(requestId);
  if (!doc) throw new Error("NOT_FOUND");
  if (!["pending", "reassigned"].includes(doc.status)) throw new Error("ALREADY_HANDLED");

  if (action === "decline") {
    doc.status = "reassigned";
    doc.nurseId = null;
    doc.nurseName = "";
    doc.nursePhone = "";
    await doc.save();
    return doc;
  }

  doc.status = "accepted";
  doc.nurseId = nurseUser.id;
  doc.nurseName = nurseUser.name || "Nurse";
  doc.nursePhone = nurseUser.phone || "";
  doc.acceptedAt = new Date();
  await doc.save();
  return doc;
}

export async function cancelRequest(requestId, actor) {
  const doc = await NurseRequest.findById(requestId);
  if (!doc) throw new Error("NOT_FOUND");
  const isPatient = actor.role === "patient" && String(doc.patientId) === String(actor.id);
  const isNurse = actor.role === "nurse" && String(doc.nurseId) === String(actor.id);
  if (!isPatient && !isNurse && actor.role !== "admin") throw new Error("ACCESS_DENIED");
  if (["completed", "cancelled"].includes(doc.status)) throw new Error("CANNOT_CANCEL");

  doc.status = "cancelled";
  doc.cancelledAt = new Date();
  await doc.save();

  if (doc.paymentCaptureId) {
    try {
      await refundCapturedPayment(doc, { reason: "Nurse request cancelled", note: "Nurse request cancelled" });
    } catch (error) {
      console.warn("Nurse refund warning:", error?.message || error);
    }
  }

  return doc;
}
