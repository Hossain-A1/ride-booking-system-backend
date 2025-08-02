"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const catchAsync_1 = require("../../utils/catchAsync");
const passport_1 = __importDefault(require("passport"));
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const token_1 = require("../../utils/token");
const setCookies_1 = require("../../utils/setCookies");
const handleLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("local", (err, user, info) => {
        if (err) {
            return next(new AppError_1.default(err.statusCode || 401, err));
        }
        if (!user) {
            return next(new AppError_1.default(401, info.message));
        }
        const tokenInfo = (0, token_1.createUserToken)(user);
        delete user.toObject().password;
        (0, setCookies_1.setAuthCookie)(res, tokenInfo);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: 200,
            success: true,
            message: "User logged in Successfully",
            data: null,
        });
    })(req, res, next);
}));
//refresh token handler
const handleGetNewAccessToken = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const newAccessToken = yield (0, token_1.createNewAccessTokenWithRefreshToken)(refreshToken);
    (0, setCookies_1.setAuthCookie)(res, { accessToken: newAccessToken });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "New access token created Successfully",
        data: newAccessToken,
    });
}));
exports.AuthController = {
    handleLogin,
    handleGetNewAccessToken
};
