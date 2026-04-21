import { getNextIdentity } from "../../../lib/sequence.js";

export async function createNurseRequestNumber() {
  const counter = await getNextIdentity("nurseRequest");
  return { requestNumber: counter.seq, publicRequestId: `NUR-${String(counter.seq).padStart(4, "0")}` };
}
