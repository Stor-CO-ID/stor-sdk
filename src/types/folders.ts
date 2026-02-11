export interface StorFolder {
  id: string;
  name: string;
  parentId: string | null;
  path: string;
  depth: number;
  createdAt: string;
  updatedAt: string;
}

export interface FolderListParams {
  parentId?: string;
}

export interface FolderCreateParams {
  name: string;
  parentId?: string | null;
}

export interface FolderUpdateParams {
  name: string;
}

export interface FolderDeleteResult {
  message: string;
  filesDeleted: number;
  foldersDeleted: number;
}
