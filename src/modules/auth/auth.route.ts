import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.handleLogin);
router.post("/refresh-token", AuthController.handleGetNewAccessToken);

export const AuthRoutes = router;
