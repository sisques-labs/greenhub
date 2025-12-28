/**
 * Data Transfer Object for registering a new auth by email via command layer.
 *
 * @interface IAuthRegisterByEmailCommandDto
 * @property {string} [email] - The email of the auth (required for LOCAL provider).
 * @property {string} [password] - The password of the auth (required for LOCAL provider).
 */
export interface IAuthRegisterByEmailCommandDto {
  email: string;
  password: string;
}
