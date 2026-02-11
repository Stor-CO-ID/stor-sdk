import type { UploadProgress } from './common.js';

export interface StorFile {
  id: string;
  key: string;
  originalName: string;
  mimeType: string;
  size: number;
  downloads: number;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FileListParams {
  page?: number;
  limit?: number;
  q?: string;
  folderId?: string;
}

export interface FileUploadOptions {
  folderId?: string;
  customName?: string;
  onProgress?: (progress: UploadProgress) => void;
}

export interface FileUploadResult {
  key: string;
  size: number;
  replaced: boolean;
}

export interface FileDownloadOptions {
  expiresIn?: number;
  maxDownloads?: number;
}

export interface FileDownloadResult {
  url: string;
  expiresIn: number;
  maxDownloads: number;
  expiresAt: string;
}

export interface FileUpdateParams {
  name?: string;
}
