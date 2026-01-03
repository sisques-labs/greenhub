/**
 * Data Transfer Object for deleting a tenant via command layer.
 *
 * @interface ITenantDeleteCommandDto
 * @property {string} id - The tenant ID. Must be provided.
 */
export interface ITenantDeleteCommandDto {
	id: string;
}

