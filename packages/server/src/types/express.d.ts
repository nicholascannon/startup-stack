import type { ApiResponse } from '@startup-stack/shared';

declare module 'express' {
  // Override the json method to force the shared ApiResponse type
  interface Response {
    json: <Data = unknown, Error = unknown>(body: ApiResponse<Data, Error>) => this;
  }
}
