import { Schema, model } from "mongoose";
import { AttackSeverity } from "../utils/types";
import { BaseSchemaOptions } from "./base.model";

const ThreatSchema = new Schema(
    {
        logId: { type: Schema.Types.ObjectId, ref: "Log", required: true, },
        threatName: { type: String, required: true },
        threatType: { type: String, required: true },
        confidenceScore: {
            type: Number,
            min: 0,
            max: 100,
            required: true,
        },

        severity: {
            type: String,
            enum: Object.values(AttackSeverity),
            required: true,
        },

        ruleTriggered: {
            type: Schema.Types.ObjectId,
            ref: "Rule",
        },

        recommendation: String,

        resolved: {
            type: Boolean,
            default: false,
        },

        detectedAt: {
            type: Date,
            default: Date.now,
        },
    },
    BaseSchemaOptions
);

export default model("Threat", ThreatSchema);