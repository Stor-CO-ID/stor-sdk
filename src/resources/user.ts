import type { AxiosInstance } from 'axios';
import type { UserProfile, UsageStats } from '../types/user.js';

export class UserResource {
  constructor(private readonly http: AxiosInstance) {}

  async getProfile(): Promise<UserProfile> {
    const { data } = await this.http.get('/v1/user');
    return data.user;
  }

  async getUsage(): Promise<UsageStats> {
    const { data } = await this.http.get('/v1/user/usage');
    return data;
  }
}
