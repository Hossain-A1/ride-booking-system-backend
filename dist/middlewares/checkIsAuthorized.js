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
exports.checkIsAuthorized = void 0;
const jwt_1 = require("../utils/jwt");
const user_model_1 = require("../modules/user/user.model");
const AppError_1 = __importDefault(require("../errors/AppError"));
const env_config_1 = require("../config/env.config");
//HOF for checking authorizetion
const checkIsAuthorized = (...authRoles) => (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError_1.default(403, "No token recived");
        }
        const verifiedToken = (0, jwt_1.verifiToken)(accessToken, env_config_1.ENV.JWT_ACCESS_SECRET);
        const isUserExist = yield user_model_1.UserModel.findOne({
            email: verifiedToken.email,
        });
        if (!isUserExist) {
            throw new AppError_1.default(400, "User does not exist");
        }
        // if (!isUserExist.isVerified) {
        //   throw new AppError(400, "User is not verified");
        // }
        if (isUserExist.isBlocked) {
            throw new AppError_1.default(400, `User is Blocked`);
        }
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError_1.default(403, "You are not authorized for this action");
        }
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkIsAuthorized = checkIsAuthorized;
