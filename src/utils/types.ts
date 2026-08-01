import { HydratedDocument, Types, Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  lastLogin: Date;
  isActive: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  role?: "user" | "admin";

}

export enum Severity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum AttackType {
  NONE = "NONE",
  SQL_INJECTION = "SQL_INJECTION",
  NOSQL_INJECTION = "NOSQL_INJECTION",
  XSS = "XSS",
  RATE_LIMIT = "RATE_LIMIT",
  INVALID_JWT = "INVALID_JWT",
  BRUTE_FORCE = "BRUTE_FORCE",
  SUSPICIOUS_UPLOAD = "SUSPICIOUS_UPLOAD",
}

export enum SecurityAction {
  ALLOWED = "ALLOWED",
  BLOCKED = "BLOCKED",
  RATE_LIMITED = "RATE_LIMITED",
  TOKEN_REJECTED = "TOKEN_REJECTED",
  FILE_REJECTED = "FILE_REJECTED",
}

export interface ISecurityLog {
  user?: Types.ObjectId | null;
  ipAddress: string;
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  method: string;
  endpoint: string;
  statusCode: number;
  responseTime: number;
  userAgent?: string;
  browser?: string;
  operatingSystem?: string;
  device?: string;
  severity: Severity;
  attackType: AttackType;
  actionTaken: SecurityAction;
  createdAt: Date;
  updatedAt: Date;
  requestId: string;
}

export type SecurityLogDocument = HydratedDocument<ISecurityLog>;

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      securityLogId?: string;
      user?: IUser;

        geo?: {
        country?: string;
        region?: string;
        city?: string;
        latitude?: number;
        longitude?: number;
      };
    }
  }
}

export interface SecurityLogFilters {
  page?: number;
  limit?: number;
  ipAddress?: string;
  userId?: string;
  severity?: Severity;
  attackType?: AttackType;
  actionTaken?: SecurityAction;
  method?: string;
  endpoint?: string;
  statusCode?: number;
  country?: string;
  from?: Date;
  to?: Date;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedSecurityLogs<T> {
  logs: T[];

  pagination: PaginationMeta;
}

export interface DeleteManySecurityLogsDto {
  ids: string[];
}

export interface TopAttackType {
  attackType: AttackType;

  count: number;
}

export interface TopCountry {
  country: string;

  count: number;
}

export interface TopEndpoint {
  endpoint: string;

  count: number;
}

export interface SecurityStatistics {
  totalLogs: number;

  successfulRequests: number;

  blockedRequests: number;

  criticalThreats: number;

  highThreats: number;

  mediumThreats: number;

  lowThreats: number;

  topAttackTypes: TopAttackType[];

  topCountries: TopCountry[];

  topEndpoints: TopEndpoint[];
}

export interface IFile {
    userId: ObjectId;
    originalName: string;
    fileName: string;
    mimeType: string;
    extension: string;
    size: number;
    cloudinaryId: string;
    url: string;
    folder: string;
    uploadedByIp: string;
    isDeleted: boolean;
    deletedAt: Date;
}

export interface GeoLocation {
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
}