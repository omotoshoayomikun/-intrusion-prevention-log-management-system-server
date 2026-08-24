import User from "../../models/user.model";
import File from "../../models/file.model";
import SecurityLog from "../../models/log.model";
import { createError } from "../../config/createError";
import { Types } from "mongoose";

class UserService {
    async getDashboard(userId: string) {
        if (!Types.ObjectId.isValid(userId)) {
            throw createError(400, "Invalid user ID.");
        }

        const objectUserId = new Types.ObjectId(userId);

        const user = await User.findById(objectUserId)
            .select("-password")
            .lean();

        if (!user) {
            throw createError(404, "User not found.");
        }

        const [
            totalFiles,
            recentFiles,
            recentActivities,
            lastLogin,
        ] = await Promise.all([
            File.countDocuments({
                userId: objectUserId,
                isDeleted: false,
            }),

            File.find({
                userId: objectUserId,
                isDeleted: false,
            })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            SecurityLog.find({
                userId: objectUserId,
            })
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),

            SecurityLog.findOne({
                userId: objectUserId,
                endpoint: "/api/auth/login",
                statusCode: {
                    $gte: 200,
                    $lt: 300,
                },
            })
                .sort({ createdAt: -1 })
                .lean(),
        ]);

        const storageUsedBytes = await File.aggregate([
            {
                $match: {
                    userId: objectUserId,
                    isDeleted: false,
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$size",
                    },
                },
            },
        ]);

        const storageUsed =
            storageUsedBytes.length > 0
                ? storageUsedBytes[0].total
                : 0;

        return {
            user: {
                id: user._id,
                email: user.email,
            },

            statistics: {
                totalFiles,
            },

            storage: {
                used: storageUsed,
                total: 5 * 1024 * 1024 * 1024, // 5GB
            },

            recentFiles,

            recentActivities,

            lastLogin,
        };
    }
}

export default new UserService();