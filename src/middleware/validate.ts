import type { RequestHandler } from "express";
import { ZodSchema } from "zod";
export const validate =
  (schema: ZodSchema): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (!result.success) {
      const err: any = new Error("Validation error");
      err.status = 400;
      err.details = result.error.flatten();
      return next(err);
    }
    next();
  };
