/** biome-ignore-all lint/suspicious/noExplicitAny: testing */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LOGGER } from '../../lib/logger.js';
import { genericErrorHandler } from '../generic-error-handler.js';

vi.mock('../../lib/logger.js', () => ({
  LOGGER: {
    error: vi.fn(),
  },
}));

describe('genericErrorHandler middleware', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      requestId: 'test-request-id',
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  it('should handle generic error with 500 status and log error', () => {
    const error = new Error('Something went wrong');

    genericErrorHandler(error, req, res, next);

    expect(LOGGER.error).toHaveBeenCalledWith(
      'Error',
      expect.objectContaining({
        error: expect.objectContaining({
          message: 'Something went wrong',
        }),
        requestId: 'test-request-id',
      })
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error',
        }),
        meta: expect.objectContaining({
          requestId: 'test-request-id',
          timestamp: expect.any(String),
        }),
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  describe('JSON parsing errors', () => {
    it('should handle entity.parse.failed error with 400 status', () => {
      const error = { type: 'entity.parse.failed' };

      genericErrorHandler(error, req, res, next);

      expect(LOGGER.error).toHaveBeenCalledWith('Error', {
        error: expect.objectContaining({
          type: 'entity.parse.failed',
        }),
        requestId: 'test-request-id',
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'INVALID_REQUEST_BODY',
            message: 'Invalid request body',
          }),
          meta: expect.objectContaining({
            requestId: 'test-request-id',
            timestamp: expect.any(String),
          }),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle entity.too.large error with 413 status', () => {
      const error = { type: 'entity.too.large' };

      genericErrorHandler(error, req, res, next);

      expect(LOGGER.error).toHaveBeenCalledWith('Error', {
        error: expect.objectContaining({
          type: 'entity.too.large',
        }),
        requestId: 'test-request-id',
      });
      expect(res.status).toHaveBeenCalledWith(413);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'REQUEST_BODY_TOO_LARGE',
            message: 'Request body too large',
          }),
          meta: expect.objectContaining({
            requestId: 'test-request-id',
            timestamp: expect.any(String),
          }),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle error with different type property with 500 status', () => {
      const error = { type: 'some.other.type' };

      genericErrorHandler(error, req, res, next);

      expect(LOGGER.error).toHaveBeenCalledWith('Error', {
        error: expect.objectContaining({
          type: 'some.other.type',
        }),
        requestId: 'test-request-id',
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal server error',
          }),
          meta: expect.objectContaining({
            requestId: 'test-request-id',
            timestamp: expect.any(String),
          }),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('non-object / primitive thrown values', () => {
    const expect500AndLogWithWrapper = () => {
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal server error',
          }),
          meta: expect.objectContaining({
            requestId: 'test-request-id',
            timestamp: expect.any(String),
          }),
        })
      );
      expect(next).not.toHaveBeenCalled();
    };

    it('should handle thrown string and return 500', () => {
      genericErrorHandler('oops', req, res, next);

      expect(LOGGER.error).toHaveBeenCalledWith('Error', {
        error: 'oops',
        requestId: 'test-request-id',
      });
      expect500AndLogWithWrapper();
    });

    it('should handle thrown number and return 500', () => {
      genericErrorHandler(42, req, res, next);

      expect(LOGGER.error).toHaveBeenCalledWith('Error', {
        error: 42,
        requestId: 'test-request-id',
      });
      expect500AndLogWithWrapper();
    });

    it('should handle thrown null and return 500', () => {
      genericErrorHandler(null, req, res, next);

      expect(LOGGER.error).toHaveBeenCalledWith('Error', {
        error: null,
        requestId: 'test-request-id',
      });
      expect500AndLogWithWrapper();
    });

    it('should handle thrown undefined and return 500', () => {
      genericErrorHandler(undefined, req, res, next);

      expect(LOGGER.error).toHaveBeenCalledWith('Error', {
        error: undefined,
        requestId: 'test-request-id',
      });
      expect500AndLogWithWrapper();
    });

    it('should handle thrown boolean and return 500', () => {
      genericErrorHandler(true, req, res, next);

      expect(LOGGER.error).toHaveBeenCalledWith('Error', {
        error: true,
        requestId: 'test-request-id',
      });
      expect500AndLogWithWrapper();
    });

    it('should handle thrown symbol and return 500', () => {
      const sym = Symbol('err');
      genericErrorHandler(sym, req, res, next);

      expect(LOGGER.error).toHaveBeenCalledWith('Error', {
        error: sym,
        requestId: 'test-request-id',
      });
      expect500AndLogWithWrapper();
    });

    it('should handle thrown bigint and return 500', () => {
      genericErrorHandler(BigInt(9007199254740991), req, res, next);

      expect(LOGGER.error).toHaveBeenCalledWith('Error', {
        error: BigInt(9007199254740991),
        requestId: 'test-request-id',
      });
      expect500AndLogWithWrapper();
    });

    it('should handle thrown function and return 500', () => {
      const fn = () => {};
      genericErrorHandler(fn, req, res, next);

      expect(LOGGER.error).toHaveBeenCalledWith('Error', {
        error: fn,
        requestId: 'test-request-id',
      });
      expect500AndLogWithWrapper();
    });
  });

  describe('object-shaped but non-Error values', () => {
    it('should handle plain object with message (error-like) and return 500', () => {
      const error = { message: 'looks like an error' };

      genericErrorHandler(error, req, res, next);

      expect(LOGGER.error).toHaveBeenCalledWith('Error', {
        error: expect.objectContaining({
          message: 'looks like an error',
        }),
        requestId: 'test-request-id',
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal server error',
          }),
          meta: expect.objectContaining({
            requestId: 'test-request-id',
            timestamp: expect.any(String),
          }),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should not mutate frozen object when attaching requestId', () => {
      const error = Object.freeze({ type: 'entity.parse.failed' });

      expect(() => genericErrorHandler(error, req, res, next)).not.toThrow();

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({ code: 'INVALID_REQUEST_BODY' }),
          meta: expect.objectContaining({ requestId: 'test-request-id' }),
        })
      );
    });
  });
});
