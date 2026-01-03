/**
 * Data Transfer Object for updating an existing tenant via command layer.
 *
 * @interface ITenantUpdateCommandDto
 * @property {string} id - The tenant ID. Must be provided.
 * @property {string} [name] - The name of the tenant. Optional.
 * @property {string} [status] - The status of the tenant. Optional.
 */
export interface ITenantUpdateCommandDto {
	id: string;
	name?: string;
	status?: string;
}

