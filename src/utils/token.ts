import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../modules/user/user.interface";
import { generateToken, verifiToken } from "./jwt";
import { UserModel } from "../modules/user/user.model";
import { ENV } from "../config/env.config";
import AppError from "../errors/AppError";

export const createUserToken = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
  //access token
  const accessToken = generateToken(
    jwtPayload,
    ENV.JWT_ACCESS_SECRET,
    ENV.JWT_ACCESS_EXPIRES
  );
  //refresh token
  const refreshToken = generateToken(
    jwtPayload,
    ENV.JWT_REFRESH_SECRET,
    ENV.JWT_REFRESH_EXPIRES
  );
  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  if (!refreshToken) {
    throw new AppError(400, "No refresh token get from cookies");
  }

  const verifiRefreshToken = verifiToken(
    refreshToken,
    ENV.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await UserModel.findOne({
    email: verifiRefreshToken.email,
  });

  if (!isUserExist) {
    throw new AppError(400, "User does not exist");
  }
  if (isUserExist.isBlocked) {
    throw new AppError(400, `User is Blocked`);
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    phone: isUserExist.phone,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    ENV.JWT_ACCESS_SECRET,
    ENV.JWT_ACCESS_EXPIRES
  );

  return accessToken;
};
