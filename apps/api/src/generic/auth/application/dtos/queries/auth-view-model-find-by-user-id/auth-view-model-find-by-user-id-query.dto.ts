/**
 * Data Transfer Object for finding an auth view model by user id via query layer.
 *
 * @interface IAuthViewModelFindByUserIdQueryDto
 * @property {string} userId - The user id of the auth to find.
 */
export interface IAuthViewModelFindByUserIdQueryDto {
  userId: string;
}
