import { Schema, model } from "mongoose";
import { BaseSchemaOptions } from "./base.model";

export enum IncidentStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  FALSE_POSITIVE = "FALSE_POSITIVE",
}

const IncidentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    severity: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(IncidentStatus),
      default: IncidentStatus.OPEN,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    threats: [
      {
        type: Schema.Types.ObjectId,
        ref: "Threat",
      },
    ],

    startedAt: {
      type: Date,
      default: Date.now,
    },

    resolvedAt: Date,
  },
  BaseSchemaOptions
);

export default model("Incident", IncidentSchema);