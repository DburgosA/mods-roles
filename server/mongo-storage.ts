import { UserModel, RoleModel, IUser, IRole, User, Role, RoleWithUser, toUser, toRole } from "./models";
import mongoose from "mongoose";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(username: string): Promise<User>;

  getRoles(): Promise<RoleWithUser[]>;
  getRole(id: string): Promise<Role | undefined>;
  createRole(title: string, description: string): Promise<Role>;
  assignRole(roleId: string, userId: string): Promise<Role>;
  releaseRole(roleId: string): Promise<Role>;
}

export class MongoStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const user = await UserModel.findById(id);
    return user ? toUser(user) : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ username });
    return user ? toUser(user) : undefined;
  }

  async createUser(username: string): Promise<User> {
    const user = await UserModel.create({ username });
    return toUser(user);
  }

  async getRoles(): Promise<RoleWithUser[]> {
    const roles = await RoleModel.find().populate('assignedUserId').sort({ _id: 1 });
    
    return roles.map((role) => {
      const assignedUser = role.assignedUserId as unknown as IUser | null;
      return {
        id: role._id.toString(),
        title: role.title,
        description: role.description,
        assignedUserId: assignedUser?._id?.toString() || null,
        assignedUser: assignedUser ? toUser(assignedUser) : null,
      };
    });
  }

  async getRole(id: string): Promise<Role | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const role = await RoleModel.findById(id);
    return role ? toRole(role) : undefined;
  }

  async createRole(title: string, description: string): Promise<Role> {
    const role = await RoleModel.create({ title, description });
    return toRole(role);
  }

  async assignRole(roleId: string, userId: string): Promise<Role> {
    const role = await RoleModel.findByIdAndUpdate(
      roleId,
      { assignedUserId: new mongoose.Types.ObjectId(userId) },
      { new: true }
    );
    if (!role) throw new Error('Role not found');
    return toRole(role);
  }

  async releaseRole(roleId: string): Promise<Role> {
    const role = await RoleModel.findByIdAndUpdate(
      roleId,
      { assignedUserId: null },
      { new: true }
    );
    if (!role) throw new Error('Role not found');
    return toRole(role);
  }
}

export const storage = new MongoStorage();
