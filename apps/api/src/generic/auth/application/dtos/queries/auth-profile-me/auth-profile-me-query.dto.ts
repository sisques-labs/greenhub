/**
 * Data Transfer Object for finding auth user profile (me) via query layer.
 *
 * @interface IAuthProfileMeQueryDto
 * @property {string} userId - The internal user id (UUID).
 * @property {string} clerkUserId - The Clerk user id.
 */
export interface IAuthProfileMeQueryDto {
	userId: string;
	clerkUserId: string;
}
