export interface StorSDKConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export interface ListParams {
  page?: number;
  limit?: number;
  q?: string;
}

export interface MessageResponse {
  message: string;
}
