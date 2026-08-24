import { Request, Response, NextFunction } from "express";
import reportService from "../../services/admin/report.service";

class ReportController {

    async getReport(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const period =
                typeof req.query.period === "string"
                    ? req.query.period
                    : "daily";

            const report =
                await reportService.getReport(period);

            return res.status(200).json({
                success: true,
                message: `${period} report generated successfully.`,
                data: report,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ReportController();