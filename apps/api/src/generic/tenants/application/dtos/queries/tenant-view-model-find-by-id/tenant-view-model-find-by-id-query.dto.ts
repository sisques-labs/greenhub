/**
 * Data Transfer Object for finding a tenant view model by id via query layer.
 *
 * @interface ITenantViewModelFindByIdQueryDto
 * @property {string} id - The id of the tenant view model to find.
 */
export interface ITenantViewModelFindByIdQueryDto {
	id: string;
}

