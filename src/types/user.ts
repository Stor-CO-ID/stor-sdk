export interface UserProfile {
  id: string;
  email: string;
  name: string;
  plan: string;
  storageUsed: number;
  maxStorage: number;
  username: string | null;
  gitEnabled: boolean;
  createdAt: string;
}

export interface UsageStats {
  storageUsed: number;
  maxStorage: number;
  bandwidthUsed: number;
  maxBandwidth: number;
  plan: string;
}
