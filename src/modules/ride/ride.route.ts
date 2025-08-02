import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkIsAuthorized } from "../../middlewares/checkIsAuthorized";
import { UserRole } from "../user/user.interface";
import { bookRideZodSchema, updateRideZodSchema } from "./ride.validation";
import { RideController } from "./ride.controller";

const router = Router();

router.post(
  "/request",
  checkIsAuthorized(...Object.values(UserRole)),
  validateRequest(bookRideZodSchema),
  RideController.handleBookRide
);

//user only update rides ( CANCEl ) status, before accepted their ride
router.patch(
  "/:id/status",
  checkIsAuthorized(...Object.values(UserRole)),
  validateRequest(updateRideZodSchema),
  RideController.handleUpdateRide
);

router.get(
  "/",
  checkIsAuthorized(UserRole.RIDER),
  RideController.handleGetUserRides
);

router.get(
  "/",
  checkIsAuthorized(UserRole.ADMIN),
  RideController.handleGetAllRides
);

router.get(
  "/me",
  checkIsAuthorized(UserRole.RIDER, UserRole.DRIVER),
  RideController.handleGetMyRides
);

export const RideRoutes = router;
