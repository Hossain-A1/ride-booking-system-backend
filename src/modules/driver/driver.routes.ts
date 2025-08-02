import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createDriverZodSchema,
  updateDriverZodSchema,
} from "./driver.validation.";
import { DriverController } from "./driver.controller";
import { checkIsAuthorized } from "../../middlewares/checkIsAuthorized";
import { UserRole } from "../user/user.interface";

const router = Router();

router.post(
  "/create-driver",
  checkIsAuthorized(UserRole.RIDER),
  validateRequest(createDriverZodSchema),
  DriverController.handleRequestDriver
);

//driver can update isOnline value after approved
//driver can only update vehicleInfo
router.patch(
  "/approve/:id",
  checkIsAuthorized(...Object.values(UserRole)),
  validateRequest(updateDriverZodSchema),
  DriverController.handleUpdateDriver
);

router.get(
  "/",
  checkIsAuthorized(UserRole.ADMIN),
  DriverController.handleGetAllDriver
);

export const DriverRoutes = router;
