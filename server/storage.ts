import { users, roles, type User, type InsertUser, type Role, type InsertRole, type RoleWithUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getRoles(): Promise<RoleWithUser[]>;
  getRole(id: number): Promise<Role | undefined>;
  createRole(role: InsertRole): Promise<Role>;
  assignRole(roleId: number, userId: number): Promise<Role>;
  releaseRole(roleId: number): Promise<Role>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getRoles(): Promise<RoleWithUser[]> {
    // Explicitly join users to populate assignedUser
    const rows = await db
      .select({
        role: roles,
        user: users,
      })
      .from(roles)
      .leftJoin(users, eq(roles.assignedUserId, users.id))
      .orderBy(roles.id);

    return rows.map((row) => ({
      ...row.role,
      assignedUser: row.user,
    }));
  }

  async getRole(id: number): Promise<Role | undefined> {
    const [role] = await db.select().from(roles).where(eq(roles.id, id));
    return role;
  }

  async createRole(insertRole: InsertRole): Promise<Role> {
    const [role] = await db.insert(roles).values(insertRole).returning();
    return role;
  }

  async assignRole(roleId: number, userId: number): Promise<Role> {
    const [updatedRole] = await db
      .update(roles)
      .set({ assignedUserId: userId })
      .where(eq(roles.id, roleId))
      .returning();
    return updatedRole;
  }

  async releaseRole(roleId: number): Promise<Role> {
    const [updatedRole] = await db
      .update(roles)
      .set({ assignedUserId: null })
      .where(eq(roles.id, roleId))
      .returning();
    return updatedRole;
  }
}

export const storage = new DatabaseStorage();
