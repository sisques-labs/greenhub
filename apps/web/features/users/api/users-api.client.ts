/**
 * Users API Client
 * Handles HTTP requests to Next.js API routes for users
 */

import { httpClient } from '@/lib/client/http-client';
import type {
  UserResponse,
  UserFindByIdInput,
  UpdateUserInput,
  UserMutationResponse,
} from './types';

export const usersApiClient = {
  /**
   * Find user by ID
   */
  findById: async (input: UserFindByIdInput): Promise<UserResponse | null> => {
    return httpClient.get<UserResponse | null>(`/api/users/${input.id}`);
  },

  /**
   * Update user
   */
  update: async (
    id: string,
    input: Omit<UpdateUserInput, 'id'>
  ): Promise<UserMutationResponse> => {
    return httpClient.put<UserMutationResponse>(
      `/api/users/${id}/update`,
      input
    );
  },
};
