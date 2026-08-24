import SecurityLog from "../../models/log.model";
import File from "../../models/file.model";

type ReportPeriod = "daily" | "weekly" | "monthly";

class ReportService {

    async getReport(period: string) {

        const reportPeriod: ReportPeriod =
            period === "weekly" || period === "monthly"
                ? period
                : "daily";

        const now = new Date();

        const startDate = new Date(now);

        if (reportPeriod === "daily") {
            startDate.setHours(0, 0, 0, 0);
        }

        if (reportPeriod === "weekly") {
            startDate.setDate(
                startDate.getDate() - 7
            );
        }

        if (reportPeriod === "monthly") {
            startDate.setMonth(
                startDate.getMonth() - 1
            );
        }

        const dateFilter = {
            createdAt: {
                $gte: startDate,
                $lte: now,
            },
        };

        const [
            totalRequests,
            successfulLogins,
            failedLogins,
            blockedRequests,
            filesUploaded,
            attackTypes,
            topEndpoints,
            topAttackingIps,
        ] = await Promise.all([

            /**
             * Total Requests
             */
            SecurityLog.countDocuments(
                dateFilter
            ),

            /**
             * Successful Login Requests
             */
            SecurityLog.countDocuments({
                ...dateFilter,
                endpoint: "/api/auth/login",
                statusCode: {
                    $gte: 200,
                    $lt: 300,
                },
            }),

            /**
             * Failed Login Requests
             */
            SecurityLog.countDocuments({
                ...dateFilter,
                endpoint: "/api/auth/login",
                statusCode: {
                    $gte: 400,
                },
            }),

            /**
             * Blocked Requests
             */
            SecurityLog.countDocuments({
                ...dateFilter,
                actionTaken: "BLOCKED" as any,
            }),

            /**
             * Files Uploaded
             */
            File.countDocuments(
                dateFilter
            ),

            /**
             * Attack Types
             */
            SecurityLog.aggregate([
                {
                    $match: {
                        ...dateFilter,
                        attackType: {
                            $ne: "NONE",
                        },
                    },
                },
                {
                    $group: {
                        _id: "$attackType",
                        value: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $sort: {
                        value: -1,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        name: "$_id",
                        value: 1,
                    },
                },
            ]),

            /**
             * Top Targeted Endpoints
             */
            SecurityLog.aggregate([
                {
                    $match: dateFilter,
                },
                {
                    $group: {
                        _id: "$endpoint",
                        hits: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $sort: {
                        hits: -1,
                    },
                },
                {
                    $limit: 10,
                },
                {
                    $project: {
                        _id: 0,
                        endpoint: "$_id",
                        hits: 1,
                    },
                },
            ]),

            /**
             * Top Attacking IPs
             */
            SecurityLog.aggregate([
                {
                    $match: {
                        ...dateFilter,
                        attackType: {
                            $ne: "NONE",
                        },
                    },
                },
                {
                    $group: {
                        _id: "$ipAddress",
                        count: {
                            $sum: 1,
                        },
                        country: {
                            $first: "$country",
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
                        ip: "$_id",
                        country: 1,
                        count: 1,
                    },
                },
            ]),
        ]);

        return {
            period: reportPeriod,

            summary: {
                totalRequests,
                successfulLogins,
                failedLogins,
                filesUploaded,
                blockedRequests,
            },

            attackTypes,

            topEndpoints,

            topAttackingIps,
        };
    }
}

export default new ReportService();