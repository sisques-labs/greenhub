/**
 * User API Types
 * Defines request/response interfaces for user-related API calls
 */

export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';

/**
 * User Response from API
 */
export interface UserResponse {
	userId: string;
	name: string | null;
	lastName: string | null;
	userName: string | null;
	bio: string | null;
	email: string | null;
	role: UserRole;
	status: UserStatus;
	avatarUrl: string | null;
	phoneNumber: string | null;
	emailVerified: boolean;
	twoFactorEnabled: boolean;
	lastLogin: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Find user by ID input
 */
export interface UserFindByIdInput {
	id: string;
}

/**
 * Update user input
 */
export interface UpdateUserInput {
	id: string;
	name?: string;
	lastName?: string;
	userName?: string;
	bio?: string;
	avatarUrl?: string;
	role?: UserRole;
	status?: UserStatus;
}

/**
 * User API Response (from GraphQL)
 * Dates come as strings from the API
 */
export interface UserApiResponse {
	userId: string;
	name: string | null;
	lastName: string | null;
	userName: string | null;
	bio: string | null;
	email: string;
	role: UserRole;
	status: UserStatus;
	avatarUrl: string | null;
	phoneNumber: string | null;
	phoneNumberVerified: boolean;
	emailVerified: boolean;
	twoFactorEnabled: boolean;
	lastLogin: string | null;
	createdAt: string;
	updatedAt: string;
}

/**
 * Mutation response
 */
export interface UserMutationResponse {
	success: boolean;
	message?: string;
}

/**
 * Transform API response (string dates) to UserResponse (Date objects)
 */
export function transformUserResponse(
	apiUser: UserApiResponse | null,
): UserResponse | null {
	if (!apiUser) return null;

	return {
		...apiUser,
		lastLogin: apiUser.lastLogin ? new Date(apiUser.lastLogin) : null,
		createdAt: new Date(apiUser.createdAt),
		updatedAt: new Date(apiUser.updatedAt),
	};
}
