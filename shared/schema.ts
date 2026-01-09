import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
});

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  assignedUserId: integer("assigned_user_id").references(() => users.id),
});

// === RELATIONS ===
export const rolesRelations = relations(roles, ({ one }) => ({
  assignedUser: one(users, {
    fields: [roles.assignedUserId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  roles: many(roles),
}));

// === BASE SCHEMAS ===
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertRoleSchema = createInsertSchema(roles).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===
export type User = typeof users.$inferSelect;
export type Role = typeof roles.$inferSelect;

// Enhanced Role type for frontend (includes joined user data)
export type RoleWithUser = Role & { assignedUser: User | null };

export type LoginRequest = { username: string };
export type LoginResponse = User;

export type RolesListResponse = RoleWithUser[];
