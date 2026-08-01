import { z } from "zod";
import {
  AttackType,
  SecurityAction,
  Severity,
} from "../utils/types";

/**
 * Get Security Logs
 */
export const GetSecurityLogsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  ipAddress: z.string().trim().optional(),
  userId: z.string().trim().optional(),
  severity: z.nativeEnum(Severity).optional(),
  attackType: z.nativeEnum(AttackType).optional(),
  actionTaken: z.nativeEnum(SecurityAction).optional(),
  method: z.string().trim().optional(),
  endpoint: z.string().trim().optional(),
  statusCode: z.coerce.number().int().optional(),
  country: z.string().trim().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

/**
 * Get Security Log By Id
 */
export const GetSecurityLogByIdSchema = z.object({
  id: z.string().trim().min(1, "Log ID is required"),
});

/**
 * Delete Security Log
 */
export const DeleteSecurityLogSchema = z.object({
  id: z.string().trim().min(1, "Log ID is required"),
});

/**
 * Delete Multiple Logs
 */
export const DeleteManySecurityLogsSchema = z.object({
  ids: z
    .array(z.string().trim())
    .min(1, "At least one log ID is required"),
});

/**
 * Export Logs
 */
export const ExportSecurityLogsSchema = z.object({
  format: z.enum(["csv", "json"]).default("csv"),
});

/**
 * Date Range Validation
 */
export const DateRangeSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine((data) => data.from <= data.to, {
    message: "'from' date cannot be greater than 'to' date",
    path: ["from"],
  });

export type GetSecurityLogsInput = z.infer<typeof GetSecurityLogsSchema>;

export type DeleteManySecurityLogsInput = z.infer<
  typeof DeleteManySecurityLogsSchema
>;