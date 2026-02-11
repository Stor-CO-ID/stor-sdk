import type { AxiosInstance } from 'axios';
import type { PaginatedResponse } from '../types/common.js';
import type {
  StorRepo,
  RepoListParams,
  RepoCreateParams,
  RepoUpdateParams,
  RepoDeleteResult,
  RepoUploadOptions,
  RepoUploadResult,
  TreeEntry,
  TreeParams,
  BlobParams,
  Commit,
  LogParams,
} from '../types/repos.js';

export class ReposResource {
  constructor(private readonly http: AxiosInstance) {}

  async list(params?: RepoListParams): Promise<PaginatedResponse<StorRepo>> {
    const { data } = await this.http.get('/v1/repos', { params });
    return {
      items: data.repos.map(normalizeRepo),
      total: data.total,
      page: data.page,
      limit: params?.limit ?? 20,
    };
  }

  async create(params: RepoCreateParams): Promise<StorRepo> {
    const { data } = await this.http.post('/v1/repos', params);
    return normalizeRepo(data.data);
  }

  async get(repoId: string): Promise<StorRepo> {
    const { data } = await this.http.get(`/v1/repos/${repoId}`);
    return normalizeRepo(data.data);
  }

  async update(repoId: string, params: RepoUpdateParams): Promise<StorRepo> {
    const { data } = await this.http.patch(`/v1/repos/${repoId}`, params);
    return normalizeRepo(data.data);
  }

  async delete(repoId: string): Promise<RepoDeleteResult> {
    const { data } = await this.http.delete(`/v1/repos/${repoId}`);
    return data;
  }

  async uploadFile(
    repoId: string,
    file: File | Blob | Buffer,
    options?: RepoUploadOptions,
  ): Promise<RepoUploadResult> {
    const formData = new FormData();
    formData.append('file', file as Blob);
    if (options?.message) formData.append('message', options.message);

    const { data } = await this.http.post(`/v1/repos/${repoId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: options?.onProgress
        ? (event) => {
            const total = event.total ?? 0;
            const loaded = event.loaded ?? 0;
            options.onProgress!({
              loaded,
              total,
              percent: total > 0 ? Math.round((loaded / total) * 100) : 0,
            });
          }
        : undefined,
    });

    return data.data;
  }

  async getTree(repoId: string, params?: TreeParams): Promise<TreeEntry[]> {
    const { data } = await this.http.get(`/v1/repos/${repoId}/tree`, { params });
    return data.entries;
  }

  async getBlob(
    repoId: string,
    path: string,
    params?: BlobParams,
  ): Promise<ArrayBuffer> {
    const { data } = await this.http.get(`/v1/repos/${repoId}/blob/${path}`, {
      params,
      responseType: 'arraybuffer',
    });
    return data;
  }

  async getLog(repoId: string, params?: LogParams): Promise<Commit[]> {
    const { data } = await this.http.get(`/v1/repos/${repoId}/log`, { params });
    return data.commits;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeRepo(raw: any): StorRepo {
  return {
    id: raw._id ?? raw.id,
    userId: raw.userId,
    name: raw.name,
    description: raw.description ?? '',
    isPublic: raw.isPublic ?? false,
    sizeBytes: raw.sizeBytes ?? 0,
    defaultBranch: raw.defaultBranch ?? 'main',
    folderId: raw.folderId ?? null,
    clones: raw.clones ?? 0,
    pushes: raw.pushes ?? 0,
    lastPushAt: raw.lastPushAt,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}
