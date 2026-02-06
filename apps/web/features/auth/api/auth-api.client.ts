import { httpClient } from '@/lib/client/http-client';
import type {
  LoginByEmailInput,
  RegisterByEmailInput,
  LogoutInput,
  UserProfileApiResponse,
  MutationResponse,
} from './types';

/**
 * Auth API client for frontend
 * Calls Next.js API Routes (BFF layer)
 */
export const authApiClient = {
  /**
   * Login with email and password
   */
  login: async (input: LoginByEmailInput): Promise<MutationResponse> => {
    return httpClient.post<MutationResponse>('/api/auth/login', input);
  },

  /**
   * Register a new user
   */
  register: async (input: RegisterByEmailInput): Promise<MutationResponse> => {
    return httpClient.post<MutationResponse>('/api/auth/register', input);
  },

  /**
   * Logout the current user
   */
  logout: async (input: LogoutInput): Promise<MutationResponse> => {
    return httpClient.post<MutationResponse>('/api/auth/logout', input);
  },

  /**
   * Get current user profile (returns raw API response with string dates)
   */
  me: async (): Promise<UserProfileApiResponse> => {
    return httpClient.get<UserProfileApiResponse>('/api/auth/me');
  },
};
