import z from "zod";
import { DriverAvailabilityStatus } from "./driver.interface";

export const vehicleInfoSchema = z.object({
  model: z.any(),
  licensePlate: z.any(),
});

export const createDriverZodSchema = z.object({
  user: z.string().optional(),
  vehicleInfo: vehicleInfoSchema,
});

export const updateDriverZodSchema = z.object({
  user: z.string().optional(),
  isOnline: z.enum(Object.values(DriverAvailabilityStatus)).optional(),
  isApproved: z.boolean().optional(),
  vehicleInfo: vehicleInfoSchema.optional(),
  totalEarnings: z.number().optional(),
  isSuspended: z.boolean().optional(),
});
