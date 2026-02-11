import type { AxiosInstance } from 'axios';
import type { PaginatedResponse } from '../types/common.js';
import type {
  StorFile,
  FileListParams,
  FileUploadOptions,
  FileUploadResult,
  FileDownloadOptions,
  FileDownloadResult,
  FileUpdateParams,
} from '../types/files.js';
import type { MessageResponse } from '../types/common.js';

export class FilesResource {
  constructor(private readonly http: AxiosInstance) {}

  async list(params?: FileListParams): Promise<PaginatedResponse<StorFile>> {
    const { data } = await this.http.get('/v1/files', { params });
    return {
      items: data.files,
      total: data.total,
      page: data.page,
      limit: data.limit,
    };
  }

  async get(fileId: string): Promise<StorFile> {
    const { data } = await this.http.get(`/v1/files/${fileId}`);
    return data.file;
  }

  async upload(
    file: File | Blob | Buffer,
    options?: FileUploadOptions,
  ): Promise<FileUploadResult> {
    const formData = new FormData();
    formData.append('file', file as Blob);
    if (options?.folderId) formData.append('folderId', options.folderId);
    if (options?.customName) formData.append('customName', options.customName);

    const { data } = await this.http.post('/v1/files/upload', formData, {
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

    return data;
  }

  async getDownloadUrl(
    fileId: string,
    options?: FileDownloadOptions,
  ): Promise<FileDownloadResult> {
    const { data } = await this.http.get(`/v1/files/${fileId}/download`, {
      params: options,
    });
    return data;
  }

  async update(fileId: string, params: FileUpdateParams): Promise<StorFile> {
    const { data } = await this.http.patch(`/v1/files/${fileId}`, params);
    return data.file;
  }

  async delete(fileId: string): Promise<MessageResponse> {
    const { data } = await this.http.delete(`/v1/files/${fileId}`);
    return data;
  }
}
