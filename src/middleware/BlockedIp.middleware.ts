import { NextFunction, Request, Response } from "express";
import BlockedIP from "../models/blockedIp.model";
import { getClientIp } from "../config/getClientIp";
import { AttackType, SecurityAction, Severity, } from "../utils/types";

const blockedIpMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ip = getClientIp(req);

        const blockedIp = await BlockedIP.findOne({
            ipAddress: ip,
            isActive: true,
        }).lean();

        if (!blockedIp) {
            return next();
        }

        // Expired temporary block
        // if (blockedIp.expiresAt && blockedIp.expiresAt.getTime() <= Date.now()) {
        //     await BlockedIP.findByIdAndUpdate(blockedIp._id, {
        //         isActive: false,
        //     });

        //     return next();
        // }

        req.security = {
            ...req.security,
            severity: Severity.CRITICAL,
            attackType: AttackType.NONE,
            actionTaken: SecurityAction.BLOCKED,
            blockedIp: true,
        };

        return res.status(403).json({
            success: false,
            message: "Your IP address has been blocked.",
        });
    } catch (error) {
        next(error);
    }
};

export default blockedIpMiddleware;