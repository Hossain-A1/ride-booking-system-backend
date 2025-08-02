import  { model, Schema } from "mongoose";
import { DriverAvailabilityStatus, IDriver } from "./driver.interface";

const driverSchema = new Schema<IDriver>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },

    isApproved: { type: Boolean, default: false },
    isOnline: {
      type: String,
      enum: Object.values(DriverAvailabilityStatus),
      default: DriverAvailabilityStatus.OFFLINE,
    },

    vehicleInfo: {
      model: { type: String },
      licensePlate: { type: String },
    },

    totalEarnings: { type: Number, default: 0 },

    isSuspended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const DriverModel= model<IDriver>("Driver", driverSchema);
