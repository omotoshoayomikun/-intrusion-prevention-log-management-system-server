import { Router } from "express";
import { verifyUser, verifyAdmin } from "../../middleware/verifyToken";
import { securityMiddleware } from "../../middleware";
import securityLogController from "../../controllers/log/log.controller";

const router = Router();

/**
 * Dashboard
 */
router.get(
    "/dashboard",
    verifyUser,
    verifyAdmin,
    ...securityMiddleware,
    securityLogController.getDashboard
);

/**
 * Statistics
 */
router.get(
    "/statistics",
    verifyUser,
    verifyAdmin,
    ...securityMiddleware,
    securityLogController.getStatistics
);

/**
 * Recent attacks
 */
router.get(
    "/recent-attacks",
    verifyUser,
    verifyAdmin,
    ...securityMiddleware,
    securityLogController.getRecentAttacks
);

/**
 * Get all logs
 *
 * Example:
 * GET /api/security-logs?page=1&limit=20&severity=HIGH
 */
router.get(
    "/",
    verifyUser,
    verifyAdmin,
    ...securityMiddleware,
    securityLogController.getLogs
);

/**
 * Get single log
 */
router.get(
    "/:id",
    verifyUser,
    verifyAdmin,
    ...securityMiddleware,
    securityLogController.getLogById
);

/**
 * Delete multiple logs
 */
router.delete(
    "/",
    verifyUser,
    verifyAdmin,
    securityLogController.deleteManyLogs
);

/**
 * Delete single log
 */
router.delete(
    "/:id",
    verifyUser,
    verifyAdmin,
    securityLogController.deleteLog
);

export default router;