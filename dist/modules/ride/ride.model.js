"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideModel = void 0;
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
const locationSchema = new mongoose_1.Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
}, { _id: false, versionKey: false });
const rideSchema = new mongoose_1.Schema({
    rider: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: mongoose_1.Schema.Types.ObjectId, ref: "Driver", required: true },
    pickup: { type: locationSchema, required: true },
    destination: { type: locationSchema, required: true },
    status: {
        type: String,
        enum: Object.values(ride_interface_1.RideStatus),
        required: true,
        default: ride_interface_1.RideStatus.REQUESTED,
    },
    fare: { type: Number },
    canceledAt: { type: Date },
    requestedAt: { type: Date, required: true, default: Date.now },
    acceptedAt: { type: Date },
    pickedUpAt: { type: Date },
    inTransitAt: { type: Date },
    completedAt: { type: Date },
}, { timestamps: true });
exports.RideModel = (0, mongoose_1.model)("Ride", rideSchema);
