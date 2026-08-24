import { Router } from "express";
import { verifyToken, verifyAdmin } from "../../middleware/verifyToken";
import blockedIpsController from "../../controllers/blockedIps/blockedIps.controller";

const router = Router();

/**
 * Get all blocked IPs
 *
 * GET /api/blocked-ips
 */
router.get(
    "/",
    verifyToken,
    verifyAdmin,
    blockedIpsController.getBlockedIPs
);

/**
 * Get a single blocked IP
 *
 * GET /api/blocked-ips/:id
 */
router.get(
    "/:id",
    verifyToken,
    verifyAdmin,
    blockedIpsController.getBlockedIPById
);

/**
 * Check if an IP is blocked
 *
 * GET /api/blocked-ips/check/:ip
 */
router.get(
    "/check/:ip",
    verifyToken,
    verifyAdmin,
    blockedIpsController.checkIP
);

/**
 * Unblock IP
 *
 * DELETE /api/blocked-ips/:id
 */
router.delete(
    "/:id",
    verifyToken,
    verifyAdmin,
    blockedIpsController.unblockIP
);

export default router;