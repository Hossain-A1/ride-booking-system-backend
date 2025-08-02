import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserValidationSchema } from "./user.validation";
import { UserController } from "./user.controller";
import { checkIsAuthorized } from "../../middlewares/checkIsAuthorized";
import { UserRole } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserValidationSchema),
  UserController.handleCreateUser
);
router.patch(
  "/block/:id",
  checkIsAuthorized(UserRole.ADMIN),
  UserController.handleTakeAction
);

router.get("/", checkIsAuthorized(UserRole.ADMIN), UserController.handleGetAllUser);

export const UserRoutes = router;
