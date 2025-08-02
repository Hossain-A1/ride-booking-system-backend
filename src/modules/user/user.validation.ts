import { z } from "zod";
import { UserRole } from "./user.interface";

export const createUserValidationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z
    .string({
      message: "Phone number must be a string.",
    })
    .regex(/^(\+8801|8801|01)[0-9]{9}$/, {
      message:
        "Phone number must be a valid Bangladeshi number (e.g. 01XXXXXXXXX, 8801XXXXXXXXX, or +8801XXXXXXXXX).",
    }),
  role: z.enum(Object.values(UserRole)).optional(),
});
