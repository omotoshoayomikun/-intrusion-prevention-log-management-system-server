import { Router } from "express";
import securityLogController from "../../controllers/log/log.controller";

// Authentication Middleware
// import authenticate from "../middleware/authenticate";

// Authorization Middleware
// import authorize from "../middleware/authorize";

// Enums
// import { UserRole } from "../interfaces/user.interface";

const router = Router();

/**
 * Apply Authentication
 */
// router.use(authenticate);

/**
 * Admin Only
 */
// router.use(authorize(UserRole.ADMIN));

/**
 * Dashboard
 */
router.get(
  "/dashboard",
  securityLogController.getDashboard
);

/**
 * Statistics
 */
router.get(
  "/statistics",
  securityLogController.getStatistics
);

/**
 * Recent Attacks
 */
router.get(
  "/recent-attacks",
  securityLogController.getRecentAttacks
);

/**
 * Export Logs
 */
router.get(
  "/export",
  securityLogController.exportLogs
);

/**
 * Get All Logs
 */
router.get(
  "/",
  securityLogController.getLogs
);

/**
 * Get Single Log
 */
router.get(
  "/:id",
  securityLogController.getLogById
);

/**
 * Delete Multiple Logs
 */
router.delete(
  "/",
  securityLogController.deleteManyLogs
);

/**
 * Delete Single Log
 */
router.delete(
  "/:id",
  securityLogController.deleteLog
);

export default router;