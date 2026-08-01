import { Schema, model } from "mongoose";
import { BaseSchemaOptions } from "./base.model";

const BlacklistSchema = new Schema(
  {
    ipAddress: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    reason: {
      type: String,
      required: true,
    },

    blockedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    blockedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: Date,

    isPermanent: {
      type: Boolean,
      default: false,
    },
  },
  BaseSchemaOptions
);

export default model("Blacklist", BlacklistSchema);