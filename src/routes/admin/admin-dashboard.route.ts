import { Router } from "express";

import adminDashboardController
    from "../../controllers/admin/admin-dashboard.controller";

import {
    verifyToken,
    verifyAdmin,
} from "../../middleware/verifyToken";

const router = Router();

router.get(
    "/dashboard",
    verifyToken,
    verifyAdmin,
    adminDashboardController.getDashboard
);

export default router;