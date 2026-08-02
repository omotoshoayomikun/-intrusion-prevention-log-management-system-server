import { NextFunction, Request, Response } from "express";

const XSS_PATTERNS: RegExp[] = [
    /<script\b[^>]*>/i,
    /<\/script>/i,
    /javascript:/i,
    /vbscript:/i,
    /data:text\/html/i,

    /onerror\s*=/i,
    /onload\s*=/i,
    /onclick\s*=/i,
    /onmouseover\s*=/i,
    /onfocus\s*=/i,
    /onmouseenter\s*=/i,

    /<iframe\b/i,
    /<\/iframe>/i,

    /<img\b/i,
    /<svg\b/i,
    /<object\b/i,
    /<embed\b/i,

    /document\.cookie/i,
    /document\.write/i,
    /window\.location/i,
    /eval\s*\(/i,
    /alert\s*\(/i,
];

const containsXss = (value: unknown): boolean => {
    if (value === null || value === undefined) {
        return false;
    }

    if (typeof value === "string") {
        return XSS_PATTERNS.some((pattern) => pattern.test(value));
    }

    if (Array.isArray(value)) {
        return value.some(containsXss);
    }

    if (typeof value === "object") {
        return Object.values(value).some(containsXss);
    }

    return false;
};

const xssMiddleware = (
    req: Request,
    _: Response,
    next: NextFunction
) => {
    const detected =
        containsXss(req.body) ||
        containsXss(req.query) ||
        containsXss(req.params);

    req.security = {
        ...req.security,
        xss: detected,
    };

    next();
};

export default xssMiddleware;