import { NextFunction, Request, Response } from "express";

import {
    AttackType,
    SecurityAction,
    Severity,
} from "../utils/types";

import BlockedIP from "../models/blockedIp.model";
import { getClientIp } from "../config/getClientIp";
import logger from "../config/loggerConfig";

const RISK_THRESHOLD = 60;

const riskScoreMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let score = 0;

        const security = req.security ?? {};

        /**
         * VPN Detection
         */
        if (security.vpnDetected) {
            score += 70;
        }

        /**
         * SQL Injection
         */
        if (security.sqlInjection) {
            score += 65;
        }

        /**
         * NoSQL Injection
         */
        if (security.nosqlInjection) {
            score += 65;
        }

        /**
         * XSS
         */
        if (security.xss) {
            score += 65;
        }

        /**
         * Invalid JWT
         */
        if (security.invalidJwt) {
            score += 70;
        }

        /**
         * Rate Limit
         */
        if (security.rateLimited) {
            score += 50;
        }

        /**
         * Forbidden Upload
         */
        if (security.forbiddenUpload) {
            score += 30;
        }

        if (security.foreignCountry) {
            score += 70;
        }

        /**
         * Save risk score
         */
        security.riskScore = score;

        /**
         * Determine severity
         */
        if (score >= 80) {
            security.severity = Severity.CRITICAL;
        } else if (score >= 60) {
            security.severity = Severity.HIGH;
        } else if (score >= 40) {
            security.severity = Severity.MEDIUM;
        } else {
            security.severity = Severity.LOW;
        }

        /**
         * Determine attack type
         */
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
        } else if (security.forbiddenUpload) {
            security.attackType = AttackType.SUSPICIOUS_UPLOAD;
        } else {
            security.attackType = AttackType.NONE;
        }

        /**
         * Check whether request should be blocked
         */
        if (score >= RISK_THRESHOLD) {
            security.actionTaken = SecurityAction.BLOCKED;

            req.security = security;

            const ipAddress = getClientIp(req);

            /**
             * Prevent duplicate blocked IP records.
             */
            const existingBlockedIP =
                await BlockedIP.findOne({
                    ipAddress,
                });

            if (!existingBlockedIP) {
                await BlockedIP.create({
                    ipAddress,
                    reason: "Risk score exceeded threshold",
                    riskScore: score,
                    attackType: security.attackType,
                    blockedBy: "SYSTEM",
                    blockedByUserId: null,
                });

                logger.warn(
                    `IP ${ipAddress} automatically blocked. Risk score: ${score}`
                );
            }

            return res.status(403).json({
                success: false,
                message:
                    "Request blocked by the Intrusion Prevention System.",
                riskScore: score,
                attackType: security.attackType,
                severity: security.severity,
            });
        }

        /**
         * Request is allowed
         */
        security.actionTaken = SecurityAction.ALLOWED;

        req.security = security;

        next();
    } catch (error) {
        logger.error(
            "Risk score middleware error",
            error
        );

        next(error);
    }
};

export default riskScoreMiddleware;