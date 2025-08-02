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
exports.createNewAccessTokenWithRefreshToken = exports.createUserToken = void 0;
const jwt_1 = require("./jwt");
const user_model_1 = require("../modules/user/user.model");
const env_config_1 = require("../config/env.config");
const AppError_1 = __importDefault(require("../errors/AppError"));
const createUserToken = (user) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        phone: user.phone,
        role: user.role,
    };
    //access token
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_config_1.ENV.JWT_ACCESS_SECRET, env_config_1.ENV.JWT_ACCESS_EXPIRES);
    //refresh token
    const refreshToken = (0, jwt_1.generateToken)(jwtPayload, env_config_1.ENV.JWT_REFRESH_SECRET, env_config_1.ENV.JWT_REFRESH_EXPIRES);
    return {
        accessToken,
        refreshToken,
    };
};
exports.createUserToken = createUserToken;
const createNewAccessTokenWithRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!refreshToken) {
        throw new AppError_1.default(400, "No refresh token get from cookies");
    }
    const verifiRefreshToken = (0, jwt_1.verifiToken)(refreshToken, env_config_1.ENV.JWT_REFRESH_SECRET);
    const isUserExist = yield user_model_1.UserModel.findOne({
        email: verifiRefreshToken.email,
    });
    if (!isUserExist) {
        throw new AppError_1.default(400, "User does not exist");
    }
    if (isUserExist.isBlocked) {
        throw new AppError_1.default(400, `User is Blocked`);
    }
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        phone: isUserExist.phone,
        role: isUserExist.role,
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_config_1.ENV.JWT_ACCESS_SECRET, env_config_1.ENV.JWT_ACCESS_EXPIRES);
    return accessToken;
});
exports.createNewAccessTokenWithRefreshToken = createNewAccessTokenWithRefreshToken;
