import { Request, Response, NextFunction } from "express";
import securityLogService from "../../services/log/log.service";
import { createError } from "../../config/createError";
import { AttackType, SecurityAction, Severity } from "../../utils/types";

class SecurityLogController {
    /**
     * Get all security logs
     */
    async getLogs(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const {
                page,
                limit,
                from,
                to,
                ipAddress,
                country,
                severity,
                attackType,
                actionTaken,
                method,
                endpoint,
                statusCode,
            } = req.query;

            const result = await securityLogService.getLogs({
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 20,
                from: from ? new Date(String(from)) : undefined,
                to: to ? new Date(String(to)) : undefined,
                ipAddress: ipAddress ? String(ipAddress) : undefined,
                country: country ? String(country) : undefined,
                severity: severity ? severity as Severity : undefined,
                attackType: attackType ? attackType as AttackType : undefined,
                actionTaken: actionTaken ? actionTaken as SecurityAction : undefined,
                method: method ? String(method) : undefined,
                endpoint: endpoint ? String(endpoint) : undefined,
                statusCode: statusCode
                    ? Number(statusCode)
                    : undefined,
            });

            return res.status(200).json({
                success: true,
                message: "Security logs retrieved successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get a single security log
     */
    async getLogById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;

            if (!id) {
                return next(createError(400, "Log ID is required."));
            }

            const log = await securityLogService.getLogById(id as string);

            return res.status(200).json({
                success: true,
                message: "Security log retrieved successfully.",
                data: log,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete a security log
     */
    async deleteLog(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;

            if (!id) {
                return next(createError(400, "Log ID is required."));
            }

            await securityLogService.deleteLog(id as string);

            return res.status(200).json({
                success: true,
                message: "Security log deleted successfully.",
                data: null,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete multiple security logs
     */
    async deleteManyLogs(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { ids } = req.body;

            if (!Array.isArray(ids) || ids.length === 0) {
                return next(
                    createError(
                        400,
                        "Please provide an array of log IDs."
                    )
                );
            }

            const deletedCount =
                await securityLogService.deleteManyLogs(ids);

            return res.status(200).json({
                success: true,
                message: `${deletedCount} security log(s) deleted successfully.`,
                data: {
                    deletedCount,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get security statistics
     */
    async getStatistics(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const statistics =
                await securityLogService.getStatistics();

            return res.status(200).json({
                success: true,
                message: "Security statistics retrieved successfully.",
                data: statistics,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get recent attacks
     */
    async getRecentAttacks(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const attacks =
                await securityLogService.getRecentAttacks();

            return res.status(200).json({
                success: true,
                message: "Recent attacks retrieved successfully.",
                data: attacks,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get dashboard security data
     */
    async getDashboard(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const dashboard =
                await securityLogService.getDashboard();

            return res.status(200).json({
                success: true,
                message: "Security dashboard data retrieved successfully.",
                data: dashboard,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new SecurityLogController();