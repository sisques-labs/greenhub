/**
 * Auth API types - matches backend GraphQL schema
 */

export interface LoginByEmailInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterByEmailInput {
  email: string;
  password: string;
  userName?: string;
  name?: string;
  lastName?: string;
}

export interface MutationResponse {
  success: boolean;
  message: string;
  id?: string;
}

// Raw response from API (dates as strings from GraphQL)
export interface UserProfileApiResponse {
  userId: string;
  authId: string;
  email?: string | null;
  emailVerified?: boolean | null;
  lastLoginAt?: string | null;
  phoneNumber?: string | null;
  provider?: string | null;
  providerId?: string | null;
  twoFactorEnabled?: boolean | null;
  userName?: string | null;
  name?: string | null;
  lastName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  role?: string | null;
  status?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Transformed profile with Date objects (compatible with AuthUserProfileResponse from SDK)
export interface UserProfile {
  userId: string;
  authId: string;
  email?: string | null;
  emailVerified?: boolean | null;
  lastLoginAt?: Date | null;
  phoneNumber?: string | null;
  provider?: string | null;
  providerId?: string | null;
  twoFactorEnabled?: boolean | null;
  userName?: string | null;
  name?: string | null;
  lastName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  role?: string | null;
  status?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

// Helper to transform API response to UserProfile
export function transformUserProfile(apiResponse: UserProfileApiResponse): UserProfile {
  return {
    ...apiResponse,
    lastLoginAt: apiResponse.lastLoginAt ? new Date(apiResponse.lastLoginAt) : null,
    createdAt: apiResponse.createdAt ? new Date(apiResponse.createdAt) : null,
    updatedAt: apiResponse.updatedAt ? new Date(apiResponse.updatedAt) : null,
  };
}

export interface LogoutInput {
  userId: string;
}
