import bcrypt from "bcrypt";
import { z } from "zod";
import { insertUserSchema } from "../../shared/schema.js";
import { sanitizeUser, sendZodError } from "./helpers.js";

export function registerAuthRoutes(app, { storage }) {
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existing = await storage.getUserByEmail(data.email);

      if (existing) {
        return res.status(400).json({ message: "An account with this email already exists" });
      }

      const passwordHash = await bcrypt.hash(data.password, 10);
      const user = await storage.createUser(
        data.name,
        data.email,
        passwordHash,
        data.role,
        data.phone || null,
      );

      req.session.userId = user.id;
      req.session.userRole = user.role;
      req.session.userName = user.name;

      if (typeof storage.createActivityLog === "function") {
        await storage.createActivityLog(user.id, user.name, "signup", `New ${user.role} account created`);
      }
      res.status(201).json(sanitizeUser(user));
    } catch (err) {
      return sendZodError(res, err);
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = z
        .object({ email: z.string().email(), password: z.string().min(1) })
        .parse(req.body);

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (!user.active) {
        return res.status(403).json({ message: "Your account has been deactivated. Contact an administrator." });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      req.session.userId = user.id;
      req.session.userRole = user.role;
      req.session.userName = user.name;

      if (typeof storage.createActivityLog === "function") {
        await storage.createActivityLog(user.id, user.name, "signin", `${user.role} signed in`);
      }
      res.json(sanitizeUser(user));
    } catch (err) {
      return sendZodError(res, err);
    }
  });

  app.post("/api/auth/signout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to sign out" });
      }

      res.clearCookie("connect.sid");
      res.json({ message: "Signed out" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUserById(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json(sanitizeUser(user));
  });
}
