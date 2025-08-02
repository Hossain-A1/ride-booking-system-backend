import z from "zod";
import { RideStatus } from "./ride.interface";

export const pickupSUbSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const destinationSubSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const bookRideZodSchema = z.object({
  rider: z.string().optional(),
  driver: z.string(),
  pickup: pickupSUbSchema,
  destination: destinationSubSchema,
  status: z.enum(Object.values(RideStatus)).optional(),
  fare:z.number().optional()
});


export const updateRideZodSchema = z.object({
  driver: z.string().optional(),
  pickup: pickupSUbSchema.optional(), 
  destination: destinationSubSchema.optional(), 
  status: z.enum(Object.values(RideStatus)).optional(),
  fare: z.number().optional(),
  canceledAt: z.string().datetime().optional(),
  acceptedAt: z.string().datetime().optional(),
  pickedUpAt: z.string().datetime().optional(),
  inTransitAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
});