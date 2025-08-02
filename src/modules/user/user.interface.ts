import { Document } from "mongoose";

export enum UserRole {
  RIDER = "RIDER",
  DRIVER = "DRIVER",
  ADMIN = "ADMIN",
}
//AUTH PROVIDERS
export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export interface IUser extends Partial<Document> {
  name: string;
  email: string;
  password: string;
  phone: string;
  picture?: string;
  isVerified?: boolean;
  auths: IAuthProvider[];
  role?: UserRole;
  isBlocked?: boolean;
}
