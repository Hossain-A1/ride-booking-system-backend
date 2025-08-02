import { model, Schema } from "mongoose";
import { IRide, RideStatus } from "./ride.interface";

const locationSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false,versionKey:false }
);

const rideSchema = new Schema<IRide>(
  {
    rider: { type: Schema.Types.ObjectId,  ref: "User", required: true },
    driver: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
    pickup: { type: locationSchema, required: true },
    destination: { type: locationSchema, required: true },
    status: {
      type: String,
      enum: Object.values(RideStatus),
      required: true,
      default: RideStatus.REQUESTED,
    },
    fare: { type: Number },
    canceledAt: { type: Date },
    requestedAt: { type: Date, required: true, default: Date.now },
    acceptedAt: { type: Date },
    pickedUpAt: { type: Date },
    inTransitAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const RideModel = model<IRide>("Ride", rideSchema);
