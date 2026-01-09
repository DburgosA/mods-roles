import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === Auth Routes ===

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const { username } = api.auth.login.input.parse(req.body);
      
      let user = await storage.getUserByUsername(username);
      if (!user) {
        user = await storage.createUser({ username });
      }

      req.session.userId = user.id;
      res.json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get(api.auth.me.path, async (req, res) => {
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

  app.get(api.roles.list.path, async (req, res) => {
    const roles = await storage.getRoles();
    res.json(roles);
  });

  app.post(api.roles.claim.path, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const roleId = Number(req.params.id);
    const role = await storage.getRole(roleId);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (role.assignedUserId !== null) {
      return res.status(400).json({ message: "Role already taken" });
    }

    const updatedRole = await storage.assignRole(roleId, req.session.userId);
    res.json(updatedRole);
  });

  app.post(api.roles.release.path, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const roleId = Number(req.params.id);
    const role = await storage.getRole(roleId);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (role.assignedUserId !== req.session.userId) {
      return res.status(400).json({ message: "You don't hold this role" });
    }

    const updatedRole = await storage.releaseRole(roleId);
    res.json(updatedRole);
  });

  // === Seeding ===
  await seedRoles();

  return httpServer;
}

async function seedRoles() {
  const roles = await storage.getRoles();
  if (roles.length === 0) {
    const defaultRoles = [
      { title: "Chat Moderator", description: "Monitor chat for rule violations and keep the vibes positive." },
      { title: "Link Monitor", description: "Check posted links for safety and relevance." },
      { title: "Engagement Lead", description: "Welcome new users and keep the conversation flowing." },
      { title: "Poll Manager", description: "Create and manage polls during the stream." },
      { title: "Clip Manager", description: "Create clips of highlights and funny moments." },
      { title: "Queue Manager", description: "Manage viewer queues for games or requests." },
      { title: "Bot Wrangler", description: "Manage bot commands and settings on the fly." },
      { title: "Prediction Guru", description: "Start and settle channel point predictions." },
    ];

    for (const role of defaultRoles) {
      await storage.createRole(role);
    }
    console.log("Seeded 8 default roles.");
  }
}
