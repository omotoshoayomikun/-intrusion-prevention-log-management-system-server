import { NextFunction, Request, Response } from "express";
import { AttackType, SecurityAction, Severity } from "../utils/types";
import BlockedIP from "../models/blockedIp.model";
import { getClientIp } from "../config/getClientIp";

const riskScoreMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let score = 0;
    const security = req.security ?? {};
    // VPN
    if (security.vpnDetected) {
        score += 20;
    }
    // SQL Injection
    if (security.sqlInjection) {
        score += 50;
    }
    // NoSQL Injection
    if (security.nosqlInjection) {
        score += 50;
    }
    // XSS
    if (security.xss) {
        score += 40;
    }
    // Invalid JWT
    if (security.invalidJwt) {
        score += 20;
    }
    // Rate Limit
    if (security.rateLimited) {
        score += 30;
    }
    // Forbidden Upload
    if (security.forbiddenUpload) {
        score += 30;
    }
    security.riskScore = score;
    if (score >= 80) {
        security.severity = Severity.CRITICAL;
        security.actionTaken = SecurityAction.BLOCKED;
    } else if (score >= 60) {
        security.severity = Severity.HIGH;
        security.actionTaken = SecurityAction.BLOCKED;
    } else if (score >= 40) {
        security.severity = Severity.MEDIUM;
        security.actionTaken = SecurityAction.ALLOWED;
    } else {
        security.severity = Severity.LOW;
        security.actionTaken = SecurityAction.ALLOWED;
    }
    if (security.sqlInjection) {
        security.attackType = AttackType.SQL_INJECTION;
    } else if (security.nosqlInjection) {
        security.attackType = AttackType.NOSQL_INJECTION;
    } else if (security.xss) {
        security.attackType = AttackType.XSS;
    } else if (security.invalidJwt) {
        security.attackType = AttackType.INVALID_JWT;
    } else if (security.rateLimited) {
        security.attackType = AttackType.RATE_LIMIT;
    } else {
        security.attackType = AttackType.NONE;
    }
    req.security = security;
    if (score >= 60) {

        await BlockedIP.create({
            ipAddress: getClientIp(req),
            reason: "Risk score exceeded threshold",
            riskScore: score,
            blockedBy: null, // System blocked it
            isActive: true,
        });

        req.security.actionTaken = SecurityAction.BLOCKED;

        return res.status(403).json({
            success: false,
            message: "Request blocked by the Intrusion Prevention System.",
            riskScore: score,
        });
    }
    next();
};

export default riskScoreMiddleware;