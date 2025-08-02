"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDriverZodSchema = exports.createDriverZodSchema = exports.vehicleInfoSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const driver_interface_1 = require("./driver.interface");
exports.vehicleInfoSchema = zod_1.default.object({
    model: zod_1.default.any(),
    licensePlate: zod_1.default.any(),
});
exports.createDriverZodSchema = zod_1.default.object({
    user: zod_1.default.string().optional(),
    vehicleInfo: exports.vehicleInfoSchema,
});
exports.updateDriverZodSchema = zod_1.default.object({
    user: zod_1.default.string().optional(),
    isOnline: zod_1.default.enum(Object.values(driver_interface_1.DriverAvailabilityStatus)).optional(),
    isApproved: zod_1.default.boolean().optional(),
    vehicleInfo: exports.vehicleInfoSchema.optional(),
    totalEarnings: zod_1.default.number().optional(),
    isSuspended: zod_1.default.boolean().optional(),
});
