import User from "../../models/user.model";
import File from "../../models/file.model";
import SecurityLog from "../../models/log.model";
import BlockedIP from "../../models/blockedIp.model";
import Alert from "../../models/alert.model";

class AdminDashboardService {
    async getDashboard() {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        /**
         * Run independent queries concurrently.
         */
        const [
            totalUsers,
            activeUsers,
            totalFiles,
            storageResult,
            requestsToday,
            blockedIps,
            securityAlerts,
            activeSessions,
            attackTrend,
            attackTypes,
            requestVolume,
            recentAlerts,
            recentLogs,
        ] = await Promise.all([
            /**
             * Total Users
             */
            User.countDocuments(),

            /**
             * Active Users
             *
             * Adjust this depending on your User schema.
             */
            User.countDocuments({
                isActive: true,
            }),

            /**
             * Total Files
             */
            File.countDocuments({
                isDeleted: false,
            }),

            /**
             * Storage Used
             */
            File.aggregate([
                {
                    $match: {
                        isDeleted: false,
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalStorage: {
                            $sum: "$size",
                        },
                    },
                },
            ]),

            /**
             * Requests Today
             */
            SecurityLog.countDocuments({
                createdAt: {
                    $gte: startOfToday,
                },
            }),

            /**
             * Blocked IPs
             */
            BlockedIP.countDocuments(),

            /**
             * Security Alerts
             */
            Alert.countDocuments({
                status: {
                    $in: [
                        "NEW",
                        "ACKNOWLEDGED",
                    ],
                },
            }),

            /**
             * Active Sessions
             *
             * If you don't have a session collection,
             * we will calculate this differently later.
             */
            User.countDocuments({
                isOnline: true,
            }),

            /**
             * Attack Trend - 7 Days
             */
            SecurityLog.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: sevenDaysAgo,
                        },

                        attackType: {
                            $ne: "NONE",
                        },
                    },
                },

                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt",
                            },
                        },

                        attacks: {
                            $sum: 1,
                        },

                        blocked: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            "$actionTaken",
                                            "BLOCKED",
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                    },
                },

                {
                    $sort: {
                        _id: 1,
                    },
                },
            ]),

            /**
             * Attack Types
             */
            SecurityLog.aggregate([
                {
                    $match: {
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
            ]),

            /**
             * Request Volume
             *
             * Requests grouped by hour for today.
             */
            SecurityLog.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startOfToday,
                        },
                    },
                },

                {
                    $group: {
                        _id: {
                            $hour: "$createdAt",
                        },

                        requests: {
                            $sum: 1,
                        },
                    },
                },

                {
                    $sort: {
                        "_id": 1,
                    },
                },
            ]),

            /**
             * Recent Alerts
             */
            Alert.find()
                .sort({
                    createdAt: -1,
                })
                .limit(4)
                .lean(),

            /**
             * Latest Security Logs
             */
            SecurityLog.find()
                .sort({
                    createdAt: -1,
                })
                .limit(6)
                .populate(
                    "userId",
                    "fullname email"
                )
                .lean(),
        ]);

        return {
            stats: {
                totalUsers,

                activeUsers,

                totalFiles,

                storageUsed:
                    storageResult[0]?.totalStorage ?? 0,

                requestsToday,

                blockedIps,

                securityAlerts,

                activeSessions,
            },

            attackTrend: attackTrend.map(
                (item) => ({
                    day: item._id,
                    attacks: item.attacks,
                    blocked: item.blocked,
                })
            ),

            attackTypes: attackTypes.map(
                (item) => ({
                    name: item._id,
                    value: item.value,
                })
            ),

            requestVolume: requestVolume.map(
                (item) => ({
                    hour: `${String(item._id).padStart(2, "0")}:00`,
                    requests: item.requests,
                })
            ),

            alerts: recentAlerts,

            securityLogs: recentLogs,
        };
    }
}

export default new AdminDashboardService();