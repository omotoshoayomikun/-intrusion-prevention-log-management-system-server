import { Router } from "express";
import { verifyAdmin } from "../../middleware/verifyToken";
import reportController from "../../controllers/admin/report.controller";

const router = Router();

router.get(
    "/reports",
    verifyAdmin,
    reportController.getReport
);

export default router;