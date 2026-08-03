import { NextFunction, Request, Response } from "express";
import {
    AttackType,
    SecurityAction,
    Severity,
} from "../utils/types";

interface RateLimitRecord {
    count: number;
    firstRequest: number;
}

const requestStore = new Map<string, RateLimitRecord>();

// Temporary configuration
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100;

const rateLimitMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const ip = req.ip || req.socket.remoteAddress || "";

    const now = Date.now();

    let record = requestStore.get(ip);

    if (!record) {
        requestStore.set(ip, {
            count: 1,
            firstRequest: now,
        });

        return next();
    }

    // Reset window
    if (now - record.firstRequest > WINDOW_MS) {
        record = {
            count: 1,
            firstRequest: now,
        };

        requestStore.set(ip, record);

        return next();
    }

    record.count++;

    requestStore.set(ip, record);

    if (record.count > MAX_REQUESTS) {
        req.security = {
            ...req.security,
            severity: Severity.HIGH,
            attackType: AttackType.RATE_LIMIT,
            actionTaken: SecurityAction.RATE_LIMITED,
            riskScore: (req.security?.riskScore ?? 0) + 30,
        };

        return res.status(429).json({
            success: false,
            message: "Too many requests. Please try again later.",
        });
    }

    next();
};

export default rateLimitMiddleware;