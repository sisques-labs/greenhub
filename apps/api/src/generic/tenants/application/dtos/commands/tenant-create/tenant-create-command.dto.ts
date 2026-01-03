/**
 * Data Transfer Object for creating a new tenant via command layer.
 *
 * @interface ITenantCreateCommandDto
 * @property {string} [id] - The tenant ID. If not provided, a new UUID will be generated.
 * @property {string} clerkId - The Clerk ID of the tenant. Must be provided.
 * @property {string} name - The name of the tenant. Must be provided.
 * @property {string} status - The status of the tenant. Must be provided.
 */
export interface ITenantCreateCommandDto {
	id?: string;
	clerkId: string;
	name: string;
	status: string;
}

