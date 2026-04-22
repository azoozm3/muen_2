import { NurseRequest } from "../../../models/NurseRequest.js";

export async function findNurseRequestByAnyId(id) {
  if (!id) return null;
  const textId = String(id).trim();
  if (!textId) return null;

  const byPublicId = await NurseRequest.findOne({ publicRequestId: textId });
  if (byPublicId) return byPublicId;
  if (/^[a-f\d]{24}$/i.test(textId)) return NurseRequest.findById(textId);
  return null;
}
