"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = require("../../middlewares/validateRequest");
const driver_validation_1 = require("./driver.validation.");
const driver_controller_1 = require("./driver.controller");
const checkIsAuthorized_1 = require("../../middlewares/checkIsAuthorized");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.post("/create-driver", (0, checkIsAuthorized_1.checkIsAuthorized)(user_interface_1.UserRole.RIDER), (0, validateRequest_1.validateRequest)(driver_validation_1.createDriverZodSchema), driver_controller_1.DriverController.handleRequestDriver);
//driver can update isOnline value after approved
//driver can only update vehicleInfo
router.patch("/approve/:id", (0, checkIsAuthorized_1.checkIsAuthorized)(...Object.values(user_interface_1.UserRole)), (0, validateRequest_1.validateRequest)(driver_validation_1.updateDriverZodSchema), driver_controller_1.DriverController.handleUpdateDriver);
router.get("/", (0, checkIsAuthorized_1.checkIsAuthorized)(user_interface_1.UserRole.ADMIN), driver_controller_1.DriverController.handleGetAllDriver);
exports.DriverRoutes = router;
