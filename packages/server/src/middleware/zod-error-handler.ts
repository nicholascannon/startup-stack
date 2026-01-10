import type { InvalidRequestResponse } from '@startup-stack/shared';
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

// biome-ignore lint/suspicious/noExplicitAny: required to match express error handler type
export const zodErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (!(err instanceof ZodError)) return next(err);

  return res.status(400).json<InvalidRequestResponse>({
    success: false,
    error: {
      code: 'INVALID_REQUEST',
      message: 'Invalid request',
      details: err.flatten().fieldErrors,
    },
    meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
  });
};
