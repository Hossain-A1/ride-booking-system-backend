import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifiToken } from "../utils/jwt";
import { UserModel } from "../modules/user/user.model";
import AppError from "../errors/AppError";
import { ENV } from "../config/env.config";
//HOF for checking authorizetion
export const checkIsAuthorized =
  (...authRoles: string[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "No token recived");
      }

      const verifiedToken = verifiToken(
        accessToken,
        ENV.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await UserModel.findOne({
        email: verifiedToken.email,
      });

      if (!isUserExist) {
        throw new AppError(400, "User does not exist");
      }

      // if (!isUserExist.isVerified) {
      //   throw new AppError(400, "User is not verified");
      // }
      if (isUserExist.isBlocked) {
        throw new AppError(400, `User is Blocked`);
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not authorized for this action");
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
