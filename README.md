# stor-sdk

Official Node.js SDK for the [Skuy Files](https://stor.co.id) API.

## Install

```bash
npm install stor-sdk
```

## Quick Start

```ts
import { StorSDK } from 'stor-sdk';

const stor = new StorSDK({ apiKey: 'sk_your_api_key' });

// List files
const { items, total } = await stor.files.list({ page: 1, limit: 20 });
console.log(`${total} files found`);

// Upload a file
const uploaded = await stor.files.upload(file, {
  onProgress: (p) => console.log(`${p.percent}%`),
});
```

## Configuration

```ts
const stor = new StorSDK({
  apiKey: 'sk_...',           // Required — your API key
  baseUrl: 'https://...',     // Optional — defaults to https://api-files.stor.co.id
  timeout: 30000,             // Optional — request timeout in ms (default: 30s)
});
```

## API

### Files

```ts
// List files (paginated)
const { items, total, page, limit } = await stor.files.list({
  page: 1,
  limit: 20,
  q: 'search term',
  folderId: 'folder-id',
});

// Get file detail
const file = await stor.files.get('file-id');

// Upload file
const result = await stor.files.upload(file, {
  folderId: 'optional-folder-id',
  customName: 'my-file.pdf',
  onProgress: ({ loaded, total, percent }) => {
    console.log(`${percent}% uploaded`);
  },
});

// Get signed download URL
const { url, expiresAt } = await stor.files.getDownloadUrl('file-id', {
  expiresIn: 24,       // hours
  maxDownloads: 10,
});

// Rename file
const updated = await stor.files.update('file-id', { name: 'new-name.pdf' });

// Delete file
await stor.files.delete('file-id');
```

### Folders

```ts
// List folders
const folders = await stor.folders.list({ parentId: 'parent-id' });

// Create folder
const folder = await stor.folders.create({ name: 'My Folder', parentId: null });

// Rename folder
const renamed = await stor.folders.update('folder-id', { name: 'New Name' });

// Delete folder (and all contents)
const { filesDeleted, foldersDeleted } = await stor.folders.delete('folder-id');
```

### Repos (Git Hosting)

```ts
// List repos
const { items } = await stor.repos.list({ page: 1, q: 'my-repo' });

// Create repo
const repo = await stor.repos.create({
  name: 'my-repo',
  description: 'My repository',
  isPublic: false,
});

// Get repo detail
const detail = await stor.repos.get('repo-id');

// Update repo
const updated = await stor.repos.update('repo-id', { description: 'Updated' });

// Delete repo
await stor.repos.delete('repo-id');

// Upload file to repo (auto-commits)
const upload = await stor.repos.uploadFile('repo-id', file, {
  message: 'Add README',
  onProgress: (p) => console.log(`${p.percent}%`),
});

// List files in repo
const entries = await stor.repos.getTree('repo-id', { path: 'src/' });

// Download file from repo (returns ArrayBuffer)
const blob = await stor.repos.getBlob('repo-id', 'README.md');

// Get commit history
const commits = await stor.repos.getLog('repo-id', { page: 1, limit: 20 });
```

### User

```ts
// Get profile
const profile = await stor.user.getProfile();
console.log(profile.email, profile.plan);

// Get usage stats
const usage = await stor.user.getUsage();
console.log(`${usage.storageUsed} / ${usage.maxStorage} bytes`);
```

## Error Handling

All API errors throw typed error classes:

```ts
import { StorSDK, AuthenticationError, NotFoundError, StorError } from 'stor-sdk';

try {
  await stor.files.get('non-existent');
} catch (err) {
  if (err instanceof NotFoundError) {
    console.log('File not found');
  } else if (err instanceof AuthenticationError) {
    console.log('Bad API key');
  } else if (err instanceof StorError) {
    console.log(`API error ${err.status}: ${err.message}`);
  }
}
```

| HTTP Status | Error Class | Description |
|-------------|------------|-------------|
| 401 | `AuthenticationError` | Invalid or missing API key |
| 403 | `AuthorizationError` | Insufficient scope (`.requiredScope`) |
| 404 | `NotFoundError` | Resource not found |
| 409 | `ConflictError` | Duplicate name etc. |
| 413 | `QuotaExceededError` | Storage quota exceeded |
| 429 | `RateLimitError` | Rate/bandwidth limit (`.used`, `.limit`) |
| 5xx | `StorError` | Server error |
| Network | `NetworkError` | No response received |

All errors extend `StorError` with `status`, `body`, and `cause` properties.

## TypeScript

Full TypeScript support with exported types:

```ts
import type {
  StorFile,
  StorFolder,
  StorRepo,
  PaginatedResponse,
  UploadProgress,
  UserProfile,
  UsageStats,
  TreeEntry,
  Commit,
} from 'stor-sdk';
```

## Requirements

- Node.js >= 18
- API key from [stor.co.id/dashboard](https://stor.co.id/dashboard)

## License

MIT
