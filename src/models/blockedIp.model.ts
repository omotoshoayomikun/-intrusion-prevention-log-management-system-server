import { Schema, model } from "mongoose";
import { BaseSchemaOptions } from "./base.model";
import { IBlockedIP } from "../utils/types";
// import { IBlockedIp } from "../utils/types";

const BlockedIPSchema = new Schema<IBlockedIP>(
    {
        ipAddress: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },

        reason: {
            type: String,
            required: true,
            trim: true,
        },

        riskScore: {
            type: Number,
            required: true,
            default: 0,
        },

        attackType: {
            type: String,
            default: null,
        },

        blockedBy: {
            type: String,
            enum: ["SYSTEM", "ADMIN"],
            required: true,
        },

        blockedByUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },

    BaseSchemaOptions
);

BlockedIPSchema.index({
    createdAt: -1,
});

const BlockedIP = model<IBlockedIP>(
    "BlockedIP",
    BlockedIPSchema
);

export default BlockedIP;