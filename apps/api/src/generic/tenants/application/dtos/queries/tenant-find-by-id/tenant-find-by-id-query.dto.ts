/**
 * Data Transfer Object for finding a tenant by id via query layer.
 *
 * @interface ITenantFindByIdQueryDto
 * @property {string} id - The id of the tenant to find.
 */
export interface ITenantFindByIdQueryDto {
	id: string;
}

