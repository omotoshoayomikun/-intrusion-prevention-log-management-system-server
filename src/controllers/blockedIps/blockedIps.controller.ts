import {
    Request,
    Response,
    NextFunction,
} from "express";
import blockedIpsService from "../../services/blockedIps/blockedIps.service";


class BlockedIPController {
    /**
     * Get blocked IPs
     */
    async getBlockedIPs(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;

            const result =
                await blockedIpsService.getBlockedIPs(
                    page,
                    limit
                );

            return res.status(200).json({
                success: true,
                message:
                    "Blocked IPs retrieved successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get single blocked IP
     */
    async getBlockedIPById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;

            const blockedIP =
                await blockedIpsService.getBlockedIPById(
                    id as string
                );

            return res.status(200).json({
                success: true,
                message:
                    "Blocked IP retrieved successfully.",
                data: blockedIP,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Check IP
     */
    async checkIP(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { ip } = req.params;

            const result =
                await blockedIpsService.checkIP(ip as string);

            return res.status(200).json({
                success: true,
                message: "IP status retrieved successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Unblock IP
     */
    async unblockIP(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;

            await blockedIpsService.unblockIP(id as string);

            return res.status(200).json({
                success: true,
                message:
                    "IP address has been unblocked successfully.",
                data: null,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Unblock IP by address
     */
    async unblockIPByAddress(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { ip } = req.params;

            await blockedIpsService.unblockIPByAddress(
                ip as string
            );

            return res.status(200).json({
                success: true,
                message:
                    "IP address has been unblocked successfully.",
                data: null,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new BlockedIPController();