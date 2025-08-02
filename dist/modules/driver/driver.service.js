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
exports.DriverServices = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const driver_model_1 = require("./driver.model");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const requestDriver = (payload, decoded) => __awaiter(void 0, void 0, void 0, function* () {
    const rider = yield user_model_1.UserModel.findById(decoded.userId);
    if (decoded.role !== user_interface_1.UserRole.RIDER) {
        throw new AppError_1.default(400, "Only user can request");
    }
    if (!rider) {
        throw new AppError_1.default(404, "User Not Found with the userId!");
    }
    if (rider.isBlocked) {
        throw new AppError_1.default(400, "Blocked user can not be a driver!");
    }
    const isExistDriver = yield driver_model_1.DriverModel.exists({ user: decoded.userId });
    if (isExistDriver) {
        throw new AppError_1.default(400, "You already requested for this role");
    }
    const drData = Object.assign(Object.assign({}, payload), { user: decoded.userId });
    const driver = yield driver_model_1.DriverModel.create(drData);
    return driver;
});
const updateDriver = (payload, decoded, id) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.DriverModel.findById(id);
    if (!driver) {
        throw new AppError_1.default(404, "Driver not found with the id");
    }
    if (decoded.role === user_interface_1.UserRole.RIDER && payload.vehicleInfo) {
        yield driver_model_1.DriverModel.findByIdAndUpdate(driver._id, { vehicleInfo: payload.vehicleInfo }, { new: true, runValidators: true });
        return;
    }
    if (decoded.role === user_interface_1.UserRole.DRIVER &&
        (payload.isOnline || payload.vehicleInfo)) {
        yield driver_model_1.DriverModel.findByIdAndUpdate(driver._id, { isOnline: payload.isOnline, vehicleInfo: payload.vehicleInfo }, { new: true, runValidators: true });
        return;
    }
    if (decoded.role !== user_interface_1.UserRole.ADMIN) {
        throw new AppError_1.default(403, "You are not authorozed person. Only admin can perform this action lol");
    }
    const updatedDr = yield driver_model_1.DriverModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (driver.isApproved) {
        yield user_model_1.UserModel.findByIdAndUpdate(updatedDr === null || updatedDr === void 0 ? void 0 : updatedDr.user, {
            role: user_interface_1.UserRole.DRIVER,
        });
    }
    return updatedDr;
});
const getAllDriver = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(driver_model_1.DriverModel.find(), query);
    const drivers = queryBuilder.search(["isOnline"]).filter().sort().pagenate();
    const [data, meta] = yield Promise.all([
        drivers.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
exports.DriverServices = {
    requestDriver,
    updateDriver,
    getAllDriver,
};
