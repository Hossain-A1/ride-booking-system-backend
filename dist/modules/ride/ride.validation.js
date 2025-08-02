"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRideZodSchema = exports.bookRideZodSchema = exports.destinationSubSchema = exports.pickupSUbSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const ride_interface_1 = require("./ride.interface");
exports.pickupSUbSchema = zod_1.default.object({
    lat: zod_1.default.number(),
    lng: zod_1.default.number(),
});
exports.destinationSubSchema = zod_1.default.object({
    lat: zod_1.default.number(),
    lng: zod_1.default.number(),
});
exports.bookRideZodSchema = zod_1.default.object({
    rider: zod_1.default.string().optional(),
    driver: zod_1.default.string(),
    pickup: exports.pickupSUbSchema,
    destination: exports.destinationSubSchema,
    status: zod_1.default.enum(Object.values(ride_interface_1.RideStatus)).optional(),
    fare: zod_1.default.number().optional()
});
exports.updateRideZodSchema = zod_1.default.object({
    driver: zod_1.default.string().optional(),
    pickup: exports.pickupSUbSchema.optional(),
    destination: exports.destinationSubSchema.optional(),
    status: zod_1.default.enum(Object.values(ride_interface_1.RideStatus)).optional(),
    fare: zod_1.default.number().optional(),
    canceledAt: zod_1.default.string().datetime().optional(),
    acceptedAt: zod_1.default.string().datetime().optional(),
    pickedUpAt: zod_1.default.string().datetime().optional(),
    inTransitAt: zod_1.default.string().datetime().optional(),
    completedAt: zod_1.default.string().datetime().optional(),
});
