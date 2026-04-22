import { refundCapturedPayment } from "../../services/payment-refund.service.js";

export { serializeNurseRequest } from "./routes/helpers/nurseRequestSerializers.js";
export { createNurseRequestNumber } from "./helpers/nurseRequestNumbers.js";
export { findNurseRequestByAnyId } from "./helpers/nurseRequestQueries.js";
export { buildNurseList } from "./helpers/nurseRequestLists.js";
export { updateNursePatientRatingSummary } from "./helpers/nurseRatingAggregators.js";

export async function refundNurseRequestPayment(requestDoc, reason) {
  return refundCapturedPayment(requestDoc, { reason: reason || "Refunded", note: reason || "Home nurse visit refund" });
}
