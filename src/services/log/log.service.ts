// import securityLogRepository from "../repositories/security-log.repository";
// import { FilterQuery } from "mongoose";
import { ISecurityLog, SecurityLogFilters } from "../../utils/types";
import SecurityLog from "../../models/log.model";
import { createError } from "../../config/createError";
import {
    SecurityAction,
    Severity,
    AttackType,
} from "../../utils/types";

class SecurityLogService {
    /**
     * Get Security Logs
     */
    async getLogs(filters: SecurityLogFilters) {
        // return await securityLogRepository.findAll(filters);
        const { page = 1, limit = 20, from, to, ...rest } = filters;
        const query: {
            [key: string]: unknown;
            createdAt?: {
                $gte?: Date;
                $lte?: Date;
            };
        } = {};

        Object.entries(rest).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                query[key] = value;
            }
        });

        if (from || to) {
            query.createdAt = {};
            if (from) {
                query.createdAt.$gte = from;
            }
            if (to) {
                query.createdAt.$lte = to;
            }
        }
        const logs = await SecurityLog.find(query).populate("user", "fullname email").sort({ createdAt: -1, }).skip((page - 1) * limit).limit(limit).lean();
        const total = await SecurityLog.countDocuments(query);
        return { logs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit), }, };
    }

    /**
     * Get Single Log
     */
    async getLogById(id: string) {
        // const log = await securityLogRepository.findById(id);
        const log = await SecurityLog.findById(id).populate("user", "fullname email").lean();
        if (!log) return createError(400, "Security log not found")
        return log
    }

    /**
     * Delete Security Log
     */
    async deleteLog(id: string) {
        const log = await SecurityLog.findByIdAndDelete(id);
        if (!log) return createError(400, "Security log not found.");
        return log;
    }

    /**
     * Delete Multiple Logs
     */
    async deleteManyLogs(ids: string[]) {
        const result = await SecurityLog.deleteMany({
            _id: {
                $in: ids,
            },
        });

        return result.deletedCount;
    }

    /**
     * Dashboard Statistics
     */
    /**
 * Dashboard Statistics
 */
    async getStatistics() {
        const [
            totalLogs,
            blockedRequests,
            criticalThreats,
            highThreats,
            mediumThreats,
            lowThreats,
            topAttackTypes,
            topCountries,
            topEndpoints,
        ] = await Promise.all([
            SecurityLog.countDocuments(),

            SecurityLog.countDocuments({
                actionTaken: SecurityAction.BLOCKED,
            }),

            SecurityLog.countDocuments({
                severity: Severity.CRITICAL,
            }),

            SecurityLog.countDocuments({
                severity: Severity.HIGH,
            }),

            SecurityLog.countDocuments({
                severity: Severity.MEDIUM,
            }),

            SecurityLog.countDocuments({
                severity: Severity.LOW,
            }),

            SecurityLog.aggregate([
                {
                    $group: {
                        _id: "$attackType",
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: {
                        count: -1,
                    },
                },
                {
                    $limit: 10,
                },
            ]),

            SecurityLog.aggregate([
                {
                    $group: {
                        _id: "$country",
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: {
                        count: -1,
                    },
                },
                {
                    $limit: 10,
                },
            ]),

            SecurityLog.aggregate([
                {
                    $group: {
                        _id: "$endpoint",
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: {
                        count: -1,
                    },
                },
                {
                    $limit: 10,
                },
            ]),
        ]);

        return {
            totalLogs,
            blockedRequests,
            criticalThreats,
            highThreats,
            mediumThreats,
            lowThreats,
            topAttackTypes,
            topCountries,
            topEndpoints,
        };
    }

    /**
     * Recent Attacks
     */
    async getRecentAttacks(limit = 20) {
        return await SecurityLog.find({
            attackType: {
                $ne: AttackType.NONE,
            },
        })
            .populate("user", "fullname email")
            .sort({
                createdAt: -1,
            })
            .limit(limit)
            .lean();
    }

    /**
     * Dashboard Data
     */
    /**
 * Dashboard Data
 */
    async getDashboard() {
        const [
            statistics,
            recentAttacks,
        ] = await Promise.all([
            this.getStatistics(),
            this.getRecentAttacks(),
        ]);

        return {
            summary: {
                totalLogs: statistics.totalLogs,
                blockedRequests: statistics.blockedRequests,
                criticalThreats: statistics.criticalThreats,
                highThreats: statistics.highThreats,
                mediumThreats: statistics.mediumThreats,
                lowThreats: statistics.lowThreats,
            },

            topAttackTypes: statistics.topAttackTypes,

            topCountries: statistics.topCountries,

            topEndpoints: statistics.topEndpoints,

            recentAttacks,
        };
    }
}

export default new SecurityLogService();