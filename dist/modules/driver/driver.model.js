"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverModel = void 0;
const mongoose_1 = require("mongoose");
const driver_interface_1 = require("./driver.interface");
const driverSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
    },
    isApproved: { type: Boolean, default: false },
    isOnline: {
        type: String,
        enum: Object.values(driver_interface_1.DriverAvailabilityStatus),
        default: driver_interface_1.DriverAvailabilityStatus.OFFLINE,
    },
    vehicleInfo: {
        model: { type: String },
        licensePlate: { type: String },
    },
    totalEarnings: { type: Number, default: 0 },
    isSuspended: { type: Boolean, default: false },
}, { timestamps: true });
exports.DriverModel = (0, mongoose_1.model)("Driver", driverSchema);
