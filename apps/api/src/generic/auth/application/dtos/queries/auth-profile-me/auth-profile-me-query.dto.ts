/**
 * Data Transfer Object for finding auth user profile (me) via query layer.
 *
 * @interface IAuthProfileMeQueryDto
 * @property {string} userId - The id of the user to find (extracted from JWT).
 */
export interface IAuthProfileMeQueryDto {
	userId: string;
}
