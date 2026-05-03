import { ZodError } from "zod";
import storage from "../../../storage/index.js";
import { requireAdmin, sendZodError } from "../../../routes/helpers.js";
import { getAdminUsersData } from "../../../services/admin-dashboard/index.js";
import { toggleStatusSchema, updateRoleSchema, updateUserSchema } from "../adminSchemas.js";

export function registerAdminUserRoutes(app) {
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try { res.json(await getAdminUsersData(req.query.role || "all")); }
    catch (err) {
      console.error("GET /api/admin/users error:", err);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.patch("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, updateUserSchema.parse(req.body || {}));
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      if (err instanceof ZodError) return sendZodError(res, err);
      console.error("PATCH /api/admin/users/:id error:", err);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const user = await storage.deleteUser(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ success: true });
    } catch (err) {
      console.error("DELETE /api/admin/users/:id error:", err);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  app.patch("/api/admin/users/:id/role", requireAdmin, async (req, res) => {
    try {
      const user = await storage.updateUserRole(req.params.id, updateRoleSchema.parse(req.body || {}).role);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      if (err instanceof ZodError) return sendZodError(res, err);
      console.error("PATCH /api/admin/users/:id/role error:", err);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  app.patch("/api/admin/users/:id/status", requireAdmin, async (req, res) => {
    try {
      const user = await storage.toggleUserStatus(req.params.id, toggleStatusSchema.parse(req.body || {}).active);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      if (err instanceof ZodError) return sendZodError(res, err);
      console.error("PATCH /api/admin/users/:id/status error:", err);
      res.status(500).json({ message: "Failed to update user status" });
    }
  });
}
