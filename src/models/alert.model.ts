import { Schema, model } from "mongoose";
import { BaseSchemaOptions } from "./base.model";

export enum AlertStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  FAILED = "FAILED",
}

const AlertSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    severity: String,

    recipient: String,

    emailSent: {
      type: Boolean,
      default: false,
    },

    smsSent: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: Object.values(AlertStatus),
      default: AlertStatus.PENDING,
    },
  },
  BaseSchemaOptions
);

export default model("Alert", AlertSchema);