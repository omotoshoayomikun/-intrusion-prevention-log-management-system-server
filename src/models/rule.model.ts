import { Schema, model } from "mongoose";
import { BaseSchemaOptions } from "./base.model";

export enum PreventionAction {
  BLOCK_IP = "BLOCK_IP",
  RATE_LIMIT = "RATE_LIMIT",
  CAPTCHA = "CAPTCHA",
  DROP_REQUEST = "DROP_REQUEST",
  ALLOW = "ALLOW",
}

const RuleSchema = new Schema(
  {
    ruleName: {
      type: String,
      required: true,
    },

    attackType: {
      type: String,
      required: true,
    },

    patterns: [
      {
        type: String,
      },
    ],

    severity: {
      type: String,
      required: true,
    },

    action: {
      type: String,
      enum: Object.values(PreventionAction),
      required: true,
    },

    priority: {
      type: Number,
      default: 1,
    },

    enabled: {
      type: Boolean,
      default: true,
    },
  },
  BaseSchemaOptions
);

export default model("Rule", RuleSchema);