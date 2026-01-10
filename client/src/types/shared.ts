import { z } from 'zod';

// Tipos de roles
export const insertRoleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  permissions: z.array(z.string()).default([]),
});

export const selectRoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  title: z.string().optional(),
  description: z.string().nullable(),
  permissions: z.array(z.string()),
  assignedUserId: z.number().nullable().optional(),
  assignedUser: z.object({
    id: z.number(),
    username: z.string(),
  }).nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type InsertRole = z.infer<typeof insertRoleSchema>;
export type SelectRole = z.infer<typeof selectRoleSchema>;

// Tipos de usuarios
export const insertUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  email: z.string().email().optional(),
});

export const selectUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type SelectUser = z.infer<typeof selectUserSchema>;

// Tipos de relaciones
export const insertUserRoleSchema = z.object({
  userId: z.number(),
  roleId: z.number(),
});

export const selectUserRoleSchema = z.object({
  id: z.number(),
  userId: z.number(),
  roleId: z.number(),
  assignedAt: z.date(),
});

export type InsertUserRole = z.infer<typeof insertUserRoleSchema>;
export type SelectUserRole = z.infer<typeof selectUserRoleSchema>;
