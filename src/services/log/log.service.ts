import { Types } from "mongoose";
import SecurityLog from "../../models/log.model";
import {
    ISecurityLog,
    SecurityLogFilters,
    Severity,
    AttackType,
    SecurityAction,
} from "../../utils/types";
import { createError } from "../../config/createError";


interface SecurityLogQuery {
    userId?: string | Types.ObjectId;
    ipAddress?: string;
    country?: string;
    region?: string;
    city?: string;
    method?: string;
    endpoint?: string;
    statusCode?: number;
    severity?: Severity;
    attackType?: AttackType;
    actionTaken?: SecurityAction;
    createdAt?: {
        $gte?: Date;
        $lte?: Date;
    };
}

class SecurityLogService {
    /**
     * Get Security Logs
     */
    async getLogs(filters: SecurityLogFilters) {
        const {
            page = 1,
            limit = 20,
            from,
            to,
            userId,
            ipAddress,
            country,
            region,
            city,
            method,
            endpoint,
            statusCode,
            severity,
            attackType,
            actionTaken,
        } = filters;

        const query: SecurityLogQuery = {};

        if (userId) {
            query.userId = userId;
        }

        if (ipAddress) {
            query.ipAddress = ipAddress;
        }

        if (country) {
            query.country = country;
        }

        if (region) {
            query.region = region;
        }

        if (city) {
            query.city = city;
        }

        if (method) {
            query.method = method;
        }

        if (endpoint) {
            query.endpoint = endpoint;
        }

        if (statusCode !== undefined) {
            query.statusCode = statusCode;
        }

        if (severity) {
            query.severity = severity;
        }

        if (attackType) {
            query.attackType = attackType;
        }

        if (actionTaken) {
            query.actionTaken = actionTaken;
        }

        if (from || to) {
            query.createdAt = {};

            if (from) {
                query.createdAt.$gte = from;
            }

            if (to) {
                query.createdAt.$lte = to;
            }
        }

        const skip = (page - 1) * limit;

        const [logs, total] = await Promise.all([
            SecurityLog.find(query)
                .populate("userId", "fullname email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            SecurityLog.countDocuments(query),
        ]);

        return {
            logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    /**
     * Get Single Security Log
     */
    async getLogById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw createError(400, "Invalid security log ID.");
        }

        const log = await SecurityLog.findById(id)
            .populate("userId", "fullname email")
            .lean();

        if (!log) {
            throw createError(404, "Security log not found.");
        }

        return log;
    }

    /**
     * Delete Single Security Log
     */
    async deleteLog(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw createError(400, "Invalid security log ID.");
        }

        const log = await SecurityLog.findByIdAndDelete(id);

        if (!log) {
            throw createError(404, "Security log not found.");
        }

        return log;
    }

    /**
     * Delete Multiple Security Logs
     */
    async deleteManyLogs(ids: string[]) {
        const validIds = ids.filter((id) =>
            Types.ObjectId.isValid(id)
        );

        if (validIds.length === 0) {
            throw createError(
                400,
                "No valid security log IDs were provided."
            );
        }

        const result = await SecurityLog.deleteMany({
            _id: {
                $in: validIds,
            },
        });

        return {
            deletedCount: result.deletedCount,
        };
    }

    /**
     * Get Security Statistics
     */
    async getStatistics() {
        const [
            totalLogs,
            blockedRequests,
            criticalThreats,
            highThreats,
            mediumThreats,
            lowThreats,
            totalAttacks,
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

            SecurityLog.countDocuments({
                attackType: {
                    $ne: AttackType.NONE,
                },
            }),
        ]);

        return {
            totalLogs,
            totalAttacks,
            blockedRequests,
            threats: {
                critical: criticalThreats,
                high: highThreats,
                medium: mediumThreats,
                low: lowThreats,
            },
        };
    }

    /**
     * Get Top Attack Types
     */
    async getTopAttackTypes() {
        return await SecurityLog.aggregate([
            {
                $match: {
                    attackType: {
                        $ne: AttackType.NONE,
                    },
                },
            },

            {
                $group: {
                    _id: "$attackType",
                    count: {
                        $sum: 1,
                    },
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

            {
                $project: {
                    _id: 0,
                    attackType: "$_id",
                    count: 1,
                },
            },
        ]);
    }

    /**
     * Get Top Attacking Countries
     */
    async getTopCountries() {
        return await SecurityLog.aggregate([
            {
                $match: {
                    country: {
                        $nin: [null, ""],
                    },
                },
            },

            {
                $group: {
                    _id: "$country",
                    count: {
                        $sum: 1,
                    },
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

            {
                $project: {
                    _id: 0,
                    country: "$_id",
                    count: 1,
                },
            },
        ]);
    }

    /**
     * Get Top Targeted Endpoints
     */
    async getTopEndpoints() {
        return await SecurityLog.aggregate([
            {
                $group: {
                    _id: "$endpoint",
                    count: {
                        $sum: 1,
                    },
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

            {
                $project: {
                    _id: 0,
                    endpoint: "$_id",
                    count: 1,
                },
            },
        ]);
    }

    /**
     * Get Recent Attacks
     */
    async getRecentAttacks() {
        return await SecurityLog.find({
            attackType: {
                $ne: AttackType.NONE,
            },
        })
            .populate("userId", "fullname email")
            .sort({
                createdAt: -1,
            })
            .limit(10)
            .lean();
    }

    /**
     * Get Dashboard Data
     */
    async getDashboard() {
        const [
            statistics,
            recentAttacks,
            topAttackTypes,
            topCountries,
            topEndpoints,
        ] = await Promise.all([
            this.getStatistics(),
            this.getRecentAttacks(),
            this.getTopAttackTypes(),
            this.getTopCountries(),
            this.getTopEndpoints(),
        ]);

        return {
            summary: statistics,
            recentAttacks,
            topAttackTypes,
            topCountries,
            topEndpoints,
        };
    }
}

export default new SecurityLogService();