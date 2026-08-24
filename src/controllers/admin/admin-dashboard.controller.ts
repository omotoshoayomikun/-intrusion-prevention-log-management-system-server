import {
    Request,
    Response,
    NextFunction,
} from "express";

import adminDashboardService
    from "../../services/admin/admin-dashboard.service";

class AdminDashboardController {
    async getDashboard(
        _req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const dashboard =
                await adminDashboardService.getDashboard();

            return res.status(200).json({
                success: true,
                message:
                    "Dashboard data retrieved successfully.",
                data: dashboard,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AdminDashboardController();