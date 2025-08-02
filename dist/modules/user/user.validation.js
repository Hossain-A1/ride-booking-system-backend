"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserValidationSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
exports.createUserValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name is too long"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    phone: zod_1.z
        .string({
        message: "Phone number must be a string.",
    })
        .regex(/^(\+8801|8801|01)[0-9]{9}$/, {
        message: "Phone number must be a valid Bangladeshi number (e.g. 01XXXXXXXXX, 8801XXXXXXXXX, or +8801XXXXXXXXX).",
    }),
    role: zod_1.z.enum(Object.values(user_interface_1.UserRole)).optional(),
});
