import { Types } from "mongoose";
import { createError } from "../../config/createError";
import BlockedIP from "../../models/blockedIp.model";

class BlockedIPService {
    /**
     * Get all blocked IPs
     */
    async getBlockedIPs(page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const [blockedIPs, total] = await Promise.all([
            BlockedIP.find()
                .populate(
                    "blockedByUserId",
                    "fullname email"
                )
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            BlockedIP.countDocuments(),
        ]);

        return {
            blockedIPs,

            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get a single blocked IP
     */
    async getBlockedIPById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw createError(
                400,
                "Invalid blocked IP ID."
            );
        }

        const blockedIP = await BlockedIP.findById(id)
            .populate(
                "blockedByUserId",
                "fullname email"
            )
            .lean();

        if (!blockedIP) {
            throw createError(
                404,
                "Blocked IP not found."
            );
        }

        return blockedIP;
    }

    /**
     * Check whether an IP is blocked
     */
    async checkIP(ipAddress: string) {
        const blockedIP = await BlockedIP.findOne({
            ipAddress,
        }).lean();

        return {
            blocked: Boolean(blockedIP),
            data: blockedIP,
        };
    }

    /**
     * Unblock IP by ID
     *
     * Unblocking means deleting the record.
     */
    async unblockIP(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw createError(
                400,
                "Invalid blocked IP ID."
            );
        }

        const blockedIP =
            await BlockedIP.findByIdAndDelete(id);

        if (!blockedIP) {
            throw createError(
                404,
                "Blocked IP not found."
            );
        }

        return blockedIP;
    }

    /**
     * Unblock IP by IP address
     */
    async unblockIPByAddress(ipAddress: string) {
        const blockedIP =
            await BlockedIP.findOneAndDelete({
                ipAddress,
            });

        if (!blockedIP) {
            throw createError(
                404,
                "IP address is not blocked."
            );
        }

        return blockedIP;
    }
}

export default new BlockedIPService();