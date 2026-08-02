import { Router } from "express";
import AuthController from "../../controllers/auth/auth.controller";
import { securityMiddleware } from "../../utils/app";

const router = Router();

router.post("/register", ...securityMiddleware, AuthController.register);

router.post("/login", ...securityMiddleware, AuthController.login);

// router.post("/refresh-token", AuthController.refreshToken);

// router.post("/logout", AuthController.logout);

// router.get("/me", AuthController.getProfile);

export default router;