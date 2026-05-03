export function getSectionFromPath(pathname) {
  const cleanPath = pathname.replace(/\/+$/, "") || "/dashboard/admin";
  const part = cleanPath.split("/").pop();
  if (!part || part === "admin") return "dashboard";
  return part;
}

export function getSectionState(section, queries) {
  switch (section) {
    case "users":
    case "doctors":
    case "nurses":
    case "patients":
    case "volunteers":
      return queries.usersQuery;
    case "requests":
    case "emergency-requests":
    case "nurse-requests":
    case "volunteer-requests":
      return queries.requestsQuery;
    case "appointments":
      return queries.appointmentsQuery;
    case "payments":
      return queries.paymentsQuery;
    case "analytics":
      return queries.analyticsQuery;
    case "settings":
      return queries.settingsQuery;
    default:
      return queries.dashboardQuery;
  }
}
