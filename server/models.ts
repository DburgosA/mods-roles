import mongoose, { Schema, Document } from 'mongoose';

// === User Model ===
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
}, { timestamps: true });

export const UserModel = mongoose.model<IUser>('User', userSchema);

// === Role Model ===
export interface IRole extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  assignedUserId: mongoose.Types.ObjectId | null;
}

const roleSchema = new Schema<IRole>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedUserId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

export const RoleModel = mongoose.model<IRole>('Role', roleSchema);

// === Type Definitions for API ===
export type User = {
  id: string;
  username: string;
};

export type Role = {
  id: string;
  title: string;
  description: string;
  assignedUserId: string | null;
};

export type RoleWithUser = Role & { assignedUser: User | null };

export type LoginRequest = { username: string };
export type LoginResponse = User;
export type RolesListResponse = RoleWithUser[];

// Helper functions to convert MongoDB documents to API types
export function toUser(doc: IUser): User {
  return {
    id: doc._id.toString(),
    username: doc.username,
  };
}

export function toRole(doc: IRole): Role {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    assignedUserId: doc.assignedUserId?.toString() || null,
  };
}
