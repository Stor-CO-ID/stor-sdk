export class StorError extends Error {
  readonly status: number;
  readonly body: unknown;
  declare readonly cause?: Error;

  constructor(message: string, status: number, body?: unknown, cause?: Error) {
    super(message);
    this.name = 'StorError';
    this.status = status;
    this.body = body;
    this.cause = cause;
  }
}

export class AuthenticationError extends StorError {
  constructor(message = 'Invalid or missing API key', body?: unknown, cause?: Error) {
    super(message, 401, body, cause);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends StorError {
  readonly requiredScope?: string;

  constructor(message = 'Insufficient permissions', body?: unknown, cause?: Error) {
    super(message, 403, body, cause);
    this.name = 'AuthorizationError';
    if (body && typeof body === 'object' && 'requiredScope' in body) {
      this.requiredScope = (body as { requiredScope: string }).requiredScope;
    }
  }
}

export class NotFoundError extends StorError {
  constructor(message = 'Resource not found', body?: unknown, cause?: Error) {
    super(message, 404, body, cause);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends StorError {
  constructor(message = 'Resource conflict', body?: unknown, cause?: Error) {
    super(message, 409, body, cause);
    this.name = 'ConflictError';
  }
}

export class QuotaExceededError extends StorError {
  constructor(message = 'Storage quota exceeded', body?: unknown, cause?: Error) {
    super(message, 413, body, cause);
    this.name = 'QuotaExceededError';
  }
}

export class RateLimitError extends StorError {
  readonly used?: number;
  readonly limit?: number;

  constructor(message = 'Rate limit exceeded', body?: unknown, cause?: Error) {
    super(message, 429, body, cause);
    this.name = 'RateLimitError';
    if (body && typeof body === 'object') {
      const b = body as Record<string, unknown>;
      if (typeof b.used === 'number') this.used = b.used;
      if (typeof b.limit === 'number') this.limit = b.limit;
    }
  }
}

export class NetworkError extends StorError {
  constructor(message = 'Network error', cause?: Error) {
    super(message, 0, undefined, cause);
    this.name = 'NetworkError';
  }
}
