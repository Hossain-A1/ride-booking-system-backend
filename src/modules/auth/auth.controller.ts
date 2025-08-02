/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { catchAsync } from "../../utils/catchAsync";
import passport from "passport";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errors/AppError";
import {
  createNewAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utils/token";
import { setAuthCookie } from "../../utils/setCookies";

const handleLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(new AppError(err.statusCode || 401, err));
      }

      if (!user) {
        return next(new AppError(401, info.message));
      }
      const tokenInfo = createUserToken(user);

      delete user.toObject().password;

      setAuthCookie(res, tokenInfo);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User logged in Successfully",
        data: null,
      });
    })(req, res, next);
  }
);

//refresh token handler
const handleGetNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    const newAccessToken = await createNewAccessTokenWithRefreshToken(
      refreshToken
    );

    setAuthCookie(res, { accessToken: newAccessToken });

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "New access token created Successfully",
      data: newAccessToken,
    });
  }
);

export const AuthController = {
  handleLogin,
  handleGetNewAccessToken
};
