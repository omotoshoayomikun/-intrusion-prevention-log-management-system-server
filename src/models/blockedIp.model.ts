import { Schema, model } from "mongoose";
import { BaseSchemaOptions } from "./base.model";
import { IBlockedIp } from "../utils/types";

const BlockedIpSchema = new Schema<IBlockedIp>(
  {
    ipAddress: { type: String, required: true, unique: true, index: true },
    reason: { type: String, required: true },
    blockedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    blockedBySystem: { type: Boolean, default: true},
    riskScore: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    // expiresAt: { type: Date, default: null },
  },
  
  BaseSchemaOptions
);

const BlockedIP = model<IBlockedIp>("BlockedIP", BlockedIpSchema);

export default BlockedIP;