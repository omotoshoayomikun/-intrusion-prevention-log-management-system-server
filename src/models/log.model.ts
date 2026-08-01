import { Schema, model } from "mongoose";
import {
    AttackType,
    ISecurityLog,
    SecurityAction,
    Severity,
} from "../../src/utils/types";
import { BaseSchemaOptions } from "./base.model";

const SecurityLogSchema = new Schema<ISecurityLog>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
        ipAddress: { type: String, required: true, index: true, trim: true },
        country: { type: String, default: null, index: true },
        region: { type: String, default: null },
        city: { type: String, default: null },
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
        method: { type: String, required: true, uppercase: true, index: true },
        endpoint: { type: String, required: true, trim: true, index: true },
        statusCode: { type: Number, required: true, index: true },
        responseTime: { type: Number, required: true },
        userAgent: { type: String, default: null },
        browser: { type: String, default: null },
        operatingSystem: { type: String, default: null },
        device: { type: String, default: null },
        severity: { type: String, enum: Object.values(Severity), default: Severity.LOW, index: true },
        attackType: { type: String, enum: Object.values(AttackType), default: AttackType.NONE, index: true, },
        actionTaken: { type: String, enum: Object.values(SecurityAction), default: SecurityAction.ALLOWED, index: true, },
        requestId: { type: String, required: true, unique: true, index: true },
    },
    BaseSchemaOptions
);

/**
 * Compound indexes
 */

SecurityLogSchema.index({
    createdAt: -1,
});

SecurityLogSchema.index({
    ipAddress: 1,
    createdAt: -1,
});

SecurityLogSchema.index({
    attackType: 1,
    severity: 1,
});

SecurityLogSchema.index({
    country: 1,
    createdAt: -1,
});

SecurityLogSchema.index({
    endpoint: 1,
    method: 1,
});

const SecurityLog = model<ISecurityLog>(
    "SecurityLog",
    SecurityLogSchema
);

export default SecurityLog;