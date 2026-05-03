const PUBLIC_PROFILE_ROLES = new Set(["patient", "doctor", "nurse", "volunteer", "provider"]);

export function normalizePublicProfileRole(role) {
  const normalized = String(role || "provider").trim().toLowerCase();
  return PUBLIC_PROFILE_ROLES.has(normalized) ? normalized : "provider";
}

export function getProfilePath(id, role = "provider") {
  if (!id) return null;
  const normalizedRole = normalizePublicProfileRole(role);
  return `/${normalizedRole}/${id}`;
}

export function readPublicProfileRoute(pathname = "") {
  const [segment = "provider", id = null] = String(pathname || "").split("/").filter(Boolean);
  return {
    id,
    routeRole: normalizePublicProfileRole(segment),
  };
}
