import type { AxiosInstance } from 'axios';
import type {
  StorFolder,
  FolderListParams,
  FolderCreateParams,
  FolderUpdateParams,
  FolderDeleteResult,
} from '../types/folders.js';

export class FoldersResource {
  constructor(private readonly http: AxiosInstance) {}

  async list(params?: FolderListParams): Promise<StorFolder[]> {
    const { data } = await this.http.get('/v1/folders', { params });
    return data.folders;
  }

  async create(params: FolderCreateParams): Promise<StorFolder> {
    const { data } = await this.http.post('/v1/folders', params);
    return data.folder;
  }

  async update(folderId: string, params: FolderUpdateParams): Promise<StorFolder> {
    const { data } = await this.http.patch(`/v1/folders/${folderId}`, params);
    return data.folder;
  }

  async delete(folderId: string): Promise<FolderDeleteResult> {
    const { data } = await this.http.delete(`/v1/folders/${folderId}`);
    return data;
  }
}
