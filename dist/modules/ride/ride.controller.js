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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideController = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const ride_service_1 = require("./ride.service");
const handleBookRide = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = req.user;
    const payload = req.body;
    const ride = yield ride_service_1.RideServices.bookRide(payload, decoded);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Ride Booked Successfully",
        data: ride,
    });
}));
const handleUpdateRide = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const payload = req.body;
    const decoded = req.user;
    const updatedRide = yield ride_service_1.RideServices.updateRide(rideId, payload, decoded);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Ride updated successfully",
        data: updatedRide,
    });
}));
const handleGetMyRides = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = req.user;
    const query = req.query;
    const rides = yield ride_service_1.RideServices.getMyRides(decoded, query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Single ride return successfully",
        data: rides,
    });
}));
const handleGetAllRides = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const rides = yield ride_service_1.RideServices.getAllRide(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "All ride return successfully",
        data: rides.data,
        meta: rides.meta,
    });
}));
const handleGetUserRides = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const user = req.user;
    const rides = yield ride_service_1.RideServices.getAllUserRides(user, query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "All ride return successfully",
        data: rides.data,
        meta: rides.meta,
    });
}));
exports.RideController = {
    handleBookRide,
    handleUpdateRide,
    handleGetMyRides,
    handleGetAllRides,
    handleGetUserRides,
};
