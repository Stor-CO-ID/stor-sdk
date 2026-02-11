import type { StorSDKConfig } from './types/common.js';
import { createHttpClient } from './http.js';
import { FilesResource } from './resources/files.js';
import { FoldersResource } from './resources/folders.js';
import { ReposResource } from './resources/repos.js';
import { UserResource } from './resources/user.js';

export class StorSDK {
  readonly files: FilesResource;
  readonly folders: FoldersResource;
  readonly repos: ReposResource;
  readonly user: UserResource;

  constructor(config: StorSDKConfig) {
    if (!config.apiKey) {
      throw new Error('apiKey is required');
    }

    const http = createHttpClient(config);

    this.files = new FilesResource(http);
    this.folders = new FoldersResource(http);
    this.repos = new ReposResource(http);
    this.user = new UserResource(http);
  }
}
