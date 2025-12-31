/**
 * Auth User Profile creation view model Data Transfer Object.
 *
 * Represents the structure of data returned when combining Auth and User data for the current user profile.
 *
 * @interface IAuthUserProfileCreateViewModelDto
 * @property {string} userId - The unique identifier of the user (matches both auth.userId and user.id).
 * @property {string} authId - The unique identifier of the auth.
 * @property {string | null} email - The email of the auth.
 * @property {boolean} emailVerified - The email verified status of the auth.
 * @property {Date | null} lastLoginAt - The last login at of the auth.
 * @property {string | null} phoneNumber - The phone number of the auth.
 * @property {string} provider - The provider of the auth.
 * @property {string | null} providerId - The provider id of the auth.
 * @property {boolean} twoFactorEnabled - The two factor enabled status of the auth.
 * @property {string} userName - The username of the user.
 * @property {string | null} name - The first name of the user.
 * @property {string | null} lastName - The last name of the user.
 * @property {string | null} bio - The user's biography.
 * @property {string | null} avatarUrl - The URL to the user's avatar image.
 * @property {string} role - The role assigned to the user.
 * @property {string} status - The current status of the user.
 * @property {Date} createdAt - Timestamp when the auth was created.
 * @property {Date} updatedAt - Timestamp when the auth was last updated.
 */
export interface IAuthUserProfileCreateViewModelDto {
	userId: string;
	authId: string;
	email: string | null;
	emailVerified: boolean;
	lastLoginAt: Date | null;
	phoneNumber: string | null;
	provider: string;
	providerId: string | null;
	twoFactorEnabled: boolean;
	userName: string;
	name: string | null;
	lastName: string | null;
	bio: string | null;
	avatarUrl: string | null;
	role: string;
	status: string;
	createdAt: Date;
	updatedAt: Date;
}
