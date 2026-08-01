import { NextFunction, Request, Response } from "express";
import securityLogService from "../../services/log/log.service";
import {
  DeleteManySecurityLogsSchema,
  DeleteSecurityLogSchema,
  ExportSecurityLogsSchema,
  GetSecurityLogByIdSchema,
  GetSecurityLogsSchema,
} from "../../validations/log.validation";

class SecurityLogController {
  /**
   * GET /api/security-logs
   */
  async getLogs(req: Request,res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = GetSecurityLogsSchema.parse(req.query);

      const result = await securityLogService.getLogs(filters);

      res.status(200).json({
        success: true,
        message: "Security logs retrieved successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/security-logs/:id
   */
  async getLogById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = GetSecurityLogByIdSchema.parse(req.params);

      const log = await securityLogService.getLogById(id);

      res.status(200).json({
        success: true,
        message: "Security log retrieved successfully.",
        data: log,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/security-logs/:id
   */
  async deleteLog(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = DeleteSecurityLogSchema.parse(req.params);

      await securityLogService.deleteLog(id);

      res.status(200).json({
        success: true,
        message: "Security log deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/security-logs
   */
  async deleteManyLogs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { ids } = DeleteManySecurityLogsSchema.parse(req.body);

      const deletedCount =
        await securityLogService.deleteManyLogs(ids);

      res.status(200).json({
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
   * GET /api/security-logs/statistics
   */
  async getStatistics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const statistics =
        await securityLogService.getStatistics();

      res.status(200).json({
        success: true,
        message: "Statistics retrieved successfully.",
        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/security-logs/recent-attacks
   */
  async getRecentAttacks(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const attacks =
        await securityLogService.getRecentAttacks();

      res.status(200).json({
        success: true,
        message: "Recent attacks retrieved successfully.",
        data: attacks,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/security-logs/dashboard
   */
  async getDashboard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dashboard =
        await securityLogService.getDashboard();

      res.status(200).json({
        success: true,
        message: "Dashboard data retrieved successfully.",
        data: dashboard,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/security-logs/export
   */
  async exportLogs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { format } =
        ExportSecurityLogsSchema.parse(req.query);

      const logs = await securityLogService.getLogs({});

      res.status(200).json({
        success: true,
        message: `Security logs exported as ${format}.`,
        data: logs,
      });

      /**
       * Later:
       * Generate CSV or JSON file
       * Stream file to client
       */
    } catch (error) {
      next(error);
    }
  }
}

export default new SecurityLogController();