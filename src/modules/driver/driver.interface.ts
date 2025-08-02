import { Document, Types } from "mongoose";

export enum DriverAvailabilityStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

export interface IDriver extends Document {
  user: Types.ObjectId;
  isApproved: boolean;
  isOnline: DriverAvailabilityStatus;
  vehicleInfo?: {
    model: string;
    licensePlate: string;
  };
  totalEarnings: number;
  isSuspended: boolean;
  createdAt: Date;
  updatedAt: Date;
}