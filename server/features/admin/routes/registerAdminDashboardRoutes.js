import storage from "../../../storage/index.js";
import { requireAdmin } from "../../../routes/helpers.js";
import {
  getAdminAnalyticsData,
  getAdminAppointmentsData,
  getAdminDashboardData,
  getAdminPaymentsData,
  getAdminRequestsData,
} from "../../../services/admin-dashboard/index.js";

export function registerAdminDashboardRoutes(app) {
  app.get("/api/admin/dashboard", requireAdmin, async (_req, res) => {
    try { res.json(await getAdminDashboardData()); }
    catch (err) {
      console.error("GET /api/admin/dashboard error:", err);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  app.get("/api/admin/stats", requireAdmin, async (_req, res) => {
    try {
      const dashboard = await getAdminDashboardData();
      res.json({
        users: dashboard.summary.totalUsers,
        doctors: dashboard.summary.roleBreakdown.doctor,
        volunteers: dashboard.summary.roleBreakdown.volunteer,
        activeRequests: dashboard.summary.activeEmergencyRequests,
        appointments: dashboard.summary.appointments,
        finance: { servicePricing: dashboard.servicePricing, totals: dashboard.summary.payments },
      });
    } catch (err) {
      console.error("GET /api/admin/stats error:", err);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/admin/requests", requireAdmin, async (_req, res) => {
    try { res.json(await getAdminRequestsData()); }
    catch (err) {
      console.error("GET /api/admin/requests error:", err);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.get("/api/admin/appointments", requireAdmin, async (_req, res) => {
    try { res.json(await getAdminAppointmentsData()); }
    catch (err) {
      console.error("GET /api/admin/appointments error:", err);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.get("/api/admin/payments", requireAdmin, async (_req, res) => {
    try { res.json(await getAdminPaymentsData()); }
    catch (err) {
      console.error("GET /api/admin/payments error:", err);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.get("/api/admin/analytics", requireAdmin, async (_req, res) => {
    try { res.json(await getAdminAnalyticsData()); }
    catch (err) {
      console.error("GET /api/admin/analytics error:", err);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get("/api/admin/logs", requireAdmin, async (req, res) => {
    try {
      const limit = Number(req.query.limit || 25);
      res.json(await storage.getRecentActivity(limit));
    } catch (err) {
      console.error("GET /api/admin/logs error:", err);
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });
}
