import { NextFunction, Request, Response } from "express";

const SQL_PATTERNS: RegExp[] = [
    /\bSELECT\b/i,
    /\bINSERT\b/i,
    /\bUPDATE\b/i,
    /\bDELETE\b/i,
    /\bDROP\b/i,
    /\bUNION\b/i,
    /\bALTER\b/i,
    /\bCREATE\b/i,
    /\bTRUNCATE\b/i,
    /\bEXEC\b/i,
    /\bEXECUTE\b/i,
    /\bDECLARE\b/i,

    /UNION\s+SELECT/i,
    /OR\s+1\s*=\s*1/i,
    /AND\s+1\s*=\s*1/i,
    /--/,
    /#/,
    /\/\*/,
    /\*\//,

    /xp_/i,
    /sleep\s*\(/i,
    /benchmark\s*\(/i,
    /waitfor\s+delay/i,

    /information_schema/i,
    /load_file\s*\(/i,
    /into\s+outfile/i,
];

const containsSqlInjection = (value: unknown): boolean => {
    if (value === null || value === undefined) {
        return false;
    }

    if (typeof value === "string") {
        return SQL_PATTERNS.some((pattern) => pattern.test(value));
    }

    if (Array.isArray(value)) {
        return value.some(containsSqlInjection);
    }

    if (typeof value === "object") {
        return Object.values(value).some(containsSqlInjection);
    }

    return false;
};

const sqlInjectionMiddleware = (req: Request, _: Response, next: NextFunction) => {
    const detected =
        containsSqlInjection(req.body) ||
        containsSqlInjection(req.query) ||
        containsSqlInjection(req.params);

    req.security = {
        ...req.security,
        sqlInjection: detected,
    };

    next();
};

export default sqlInjectionMiddleware;