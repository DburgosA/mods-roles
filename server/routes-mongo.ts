import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./mongo-storage";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === Auth Routes ===

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username } = loginSchema.parse(req.body);
      
      let user = await storage.getUserByUsername(username);
      if (!user) {
        user = await storage.createUser(username);
      }

      req.session.userId = user.id;
      res.json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json(user);
  });

  // === Role Routes ===

  app.get("/api/roles", async (req, res) => {
    try {
      const roles = await storage.getRoles();
      res.json(roles);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch roles" });
    }
  });

  app.post("/api/roles/:id/claim", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const roleId = req.params.id;
      const role = await storage.getRole(roleId);

      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }

      if (role.assignedUserId !== null) {
        return res.status(400).json({ message: "Role already taken" });
      }

      const updatedRole = await storage.assignRole(roleId, req.session.userId);
      res.json(updatedRole);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to claim role" });
    }
  });

  app.post("/api/roles/:id/release", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const roleId = req.params.id;
      const role = await storage.getRole(roleId);

      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }

      if (role.assignedUserId !== req.session.userId) {
        return res.status(400).json({ message: "You don't hold this role" });
      }

      const updatedRole = await storage.releaseRole(roleId);
      res.json(updatedRole);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to release role" });
    }
  });

  // Create role (optional admin endpoint)
  app.post("/api/roles", async (req, res) => {
    try {
      const { title, description } = req.body;
      if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required" });
      }
      const role = await storage.createRole(title, description);
      res.status(201).json(role);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create role" });
    }
  });

  return httpServer;
}
