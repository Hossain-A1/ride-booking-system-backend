"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.AuthController.handleLogin);
router.post("/refresh-token", auth_controller_1.AuthController.handleGetNewAccessToken);
exports.AuthRoutes = router;
