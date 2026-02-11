import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type { StorSDKConfig } from './types/common.js';
import {
  StorError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  QuotaExceededError,
  RateLimitError,
  NetworkError,
} from './errors.js';

const DEFAULT_BASE_URL = 'https://api-files.stor.co.id';
const DEFAULT_TIMEOUT = 30_000;

export function createHttpClient(config: StorSDKConfig): AxiosInstance {
  const client = axios.create({
    baseURL: config.baseUrl || DEFAULT_BASE_URL,
    timeout: config.timeout || DEFAULT_TIMEOUT,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
    },
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ error?: string }>) => {
      if (!error.response) {
        throw new NetworkError(
          error.message || 'Network error',
          error,
        );
      }

      const { status, data } = error.response;
      const message = data?.error || error.message || 'Unknown error';

      switch (status) {
        case 401:
          throw new AuthenticationError(message, data, error);
        case 403:
          throw new AuthorizationError(message, data, error);
        case 404:
          throw new NotFoundError(message, data, error);
        case 409:
          throw new ConflictError(message, data, error);
        case 413:
          throw new QuotaExceededError(message, data, error);
        case 429:
          throw new RateLimitError(message, data, error);
        default:
          throw new StorError(message, status, data, error);
      }
    },
  );

  return client;
}
