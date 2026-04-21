import { toObjectIdString } from "../utils.js";

export function toTextId(value) {
  if (!value) return "";
  return value.toString ? value.toString() : String(value);
}

export { toObjectIdString };
