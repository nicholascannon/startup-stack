export type ApiResponse<TData, TError> =
  | {
      success: false;
      error: {
        code: string;
        message: string;
        details?: TError;
      };
      // required for errors
      meta: {
        requestId: string;
        timestamp: string;
      };
    }
  | {
      success: true;
      data: TData;
      meta?: {
        requestId: string;
        timestamp: string;
      };
    };
