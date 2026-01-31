import type {
  InternalServerErrorResponse,
  InvalidRequestBodyResponse,
  RequestBodyTooLargeResponse,
} from '@startup-stack/shared/api/errors';
import type { NextFunction, Request, Response } from 'express';
import { LOGGER } from '../lib/logger.js';

export const genericErrorHandler = (error: unknown, req: Request, res: Response, _next: NextFunction) => {
  LOGGER.error('Error', { error, requestId: req.requestId });

  if (typeof error === 'object' && error !== null && 'type' in error && error.type === 'entity.parse.failed') {
    return res.status(400).json<InvalidRequestBodyResponse>({
      error: {
        code: 'INVALID_REQUEST_BODY',
        message: 'Invalid request body',
      },
      meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
    });
  }
  if (typeof error === 'object' && error !== null && 'type' in error && error.type === 'entity.too.large') {
    return res.status(413).json<RequestBodyTooLargeResponse>({
      error: {
        code: 'REQUEST_BODY_TOO_LARGE',
        message: 'Request body too large',
      },
      meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
    });
  }

  return res.status(500).json<InternalServerErrorResponse>({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
    },
    meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
  });
};
