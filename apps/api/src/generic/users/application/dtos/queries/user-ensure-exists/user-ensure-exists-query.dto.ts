/**
 * Data Transfer Object for ensuring a user exists via query layer.
 *
 * @interface IUserEnsureExistsQueryDto
 * @property {string} clerkUserId - The Clerk user ID (used as internal user ID)
 * @property {string | null} [userName] - The username of the user
 * @property {string | null} [firstName] - The first name of the user
 * @property {string | null} [lastName] - The last name of the user
 * @property {string | null} [avatarUrl] - The avatar URL of the user
 * @property {string} [role] - The role of the user
 */
export interface IUserEnsureExistsQueryDto {
	clerkUserId: string;
	userName?: string | null;
	firstName?: string | null;
	lastName?: string | null;
	avatarUrl?: string | null;
	role?: string;
}

