/* eslint-disable @typescript-eslint/no-explicit-any */
import bcryptjs from "bcryptjs";
import { IAuthProvider, IUser, UserRole } from "../modules/user/user.interface";
import { UserModel } from "../modules/user/user.model";
import { ENV } from "../config/env.config";
import AppError from "../errors/AppError";

export const seedAdmin = async () => {
  try {
    const isAdminExist = await UserModel.findOne({
      email: ENV.ADMIN_EMAIL,
    });

    if (isAdminExist) {
      return;
    }
    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: ENV.ADMIN_EMAIL,
    };

    const hashPassword = await bcryptjs.hash(
      ENV.ADMIN_PASSWORD,
      Number(ENV.BCRYPT_SALT_ROUND)
    );

    const payload: IUser = {
      name: "Admin",
      email: ENV.ADMIN_EMAIL,
      role: UserRole.ADMIN,
      phone: ENV.ADMIN_PHONE,
      password: hashPassword,
      isVerified: true,
      auths: [authProvider],
    };

    await UserModel.create(payload);
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
};
