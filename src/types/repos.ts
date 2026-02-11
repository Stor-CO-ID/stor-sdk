import type { UploadProgress } from './common.js';

export interface StorRepo {
  id: string;
  userId: string;
  name: string;
  description: string;
  isPublic: boolean;
  sizeBytes: number;
  defaultBranch: string;
  folderId: string | null;
  clones: number;
  pushes: number;
  lastPushAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepoListParams {
  page?: number;
  limit?: number;
  q?: string;
}

export interface RepoCreateParams {
  name: string;
  description?: string;
  isPublic?: boolean;
  folderId?: string | null;
}

export interface RepoUpdateParams {
  name?: string;
  description?: string;
  isPublic?: boolean;
  folderId?: string | null;
}

export interface RepoDeleteResult {
  message: string;
  r2Key: string;
}

export interface RepoUploadOptions {
  message?: string;
  onProgress?: (progress: UploadProgress) => void;
}

export interface RepoUploadResult {
  commit: string;
  path: string;
  size: number;
  bundleSize: number;
}

export interface TreeEntry {
  mode: string;
  type: 'blob' | 'tree';
  hash: string;
  size: number;
  path: string;
}

export interface TreeParams {
  path?: string;
  ref?: string;
}

export interface BlobParams {
  ref?: string;
  inline?: boolean;
}

export interface Commit {
  hash: string;
  author: string;
  email: string;
  date: string;
  message: string;
}

export interface LogParams {
  page?: number;
  limit?: number;
  ref?: string;
}
