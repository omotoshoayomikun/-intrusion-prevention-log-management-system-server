import { NextFunction, Request, Response } from "express";

const FORBIDDEN_OPERATORS = [
    "$ne",
    "$gt",
    "$gte",
    "$lt",
    "$lte",
    "$regex",
    "$where",
    "$exists",
    "$or",
    "$and",
    "$nor",
    "$nin",
    "$in",
    "$expr",
    "$function",
];

const containsNoSqlInjection = (value: unknown): boolean => {
    if (value === null || value === undefined) {
        return false;
    }

    if (Array.isArray(value)) {
        return value.some(containsNoSqlInjection);
    }

    if (typeof value === "object") {
        const object = value as Record<string, unknown>;

        for (const [key, val] of Object.entries(object)) {
            if (FORBIDDEN_OPERATORS.includes(key)) {
                return true;
            }

            if (containsNoSqlInjection(val)) {
                return true;
            }
        }
    }

    return false;
};

const noSqlInjectionMiddleware = (req: Request, _: Response, next: NextFunction) => {
    const detected =
        containsNoSqlInjection(req.body) ||
        containsNoSqlInjection(req.query) ||
        containsNoSqlInjection(req.params);

    req.security = {
        ...req.security,
        nosqlInjection: detected,
    };

    next();
};

export default noSqlInjectionMiddleware;