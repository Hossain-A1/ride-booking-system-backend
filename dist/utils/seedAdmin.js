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
exports.seedAdmin = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const env_config_1 = require("../config/env.config");
const AppError_1 = __importDefault(require("../errors/AppError"));
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isAdminExist = yield user_model_1.UserModel.findOne({
            email: env_config_1.ENV.ADMIN_EMAIL,
        });
        if (isAdminExist) {
            return;
        }
        const authProvider = {
            provider: "credentials",
            providerId: env_config_1.ENV.ADMIN_EMAIL,
        };
        const hashPassword = yield bcryptjs_1.default.hash(env_config_1.ENV.ADMIN_PASSWORD, Number(env_config_1.ENV.BCRYPT_SALT_ROUND));
        const payload = {
            name: "Admin",
            email: env_config_1.ENV.ADMIN_EMAIL,
            role: user_interface_1.UserRole.ADMIN,
            phone: env_config_1.ENV.ADMIN_PHONE,
            password: hashPassword,
            isVerified: true,
            auths: [authProvider],
        };
        yield user_model_1.UserModel.create(payload);
    }
    catch (error) {
        throw new AppError_1.default(400, error.message);
    }
});
exports.seedAdmin = seedAdmin;
