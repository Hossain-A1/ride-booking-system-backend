"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = require("../../middlewares/validateRequest");
const checkIsAuthorized_1 = require("../../middlewares/checkIsAuthorized");
const user_interface_1 = require("../user/user.interface");
const ride_validation_1 = require("./ride.validation");
const ride_controller_1 = require("./ride.controller");
const router = (0, express_1.Router)();
router.post("/request", (0, checkIsAuthorized_1.checkIsAuthorized)(...Object.values(user_interface_1.UserRole)), (0, validateRequest_1.validateRequest)(ride_validation_1.bookRideZodSchema), ride_controller_1.RideController.handleBookRide);
//user only update rides ( CANCEl ) status, before accepted their ride
router.patch("/:id/status", (0, checkIsAuthorized_1.checkIsAuthorized)(...Object.values(user_interface_1.UserRole)), (0, validateRequest_1.validateRequest)(ride_validation_1.updateRideZodSchema), ride_controller_1.RideController.handleUpdateRide);
router.get("/", (0, checkIsAuthorized_1.checkIsAuthorized)(user_interface_1.UserRole.RIDER), ride_controller_1.RideController.handleGetUserRides);
router.get("/", (0, checkIsAuthorized_1.checkIsAuthorized)(user_interface_1.UserRole.ADMIN), ride_controller_1.RideController.handleGetAllRides);
router.get("/me", (0, checkIsAuthorized_1.checkIsAuthorized)(user_interface_1.UserRole.RIDER, user_interface_1.UserRole.DRIVER), ride_controller_1.RideController.handleGetMyRides);
exports.RideRoutes = router;
