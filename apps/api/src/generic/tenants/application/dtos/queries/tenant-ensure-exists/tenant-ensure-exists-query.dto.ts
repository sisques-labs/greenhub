/**
 * Data Transfer Object for ensuring a tenant exists via query layer.
 *
 * @interface ITenantEnsureExistsQueryDto
 * @property {string} clerkId - The Clerk organization ID (used as tenant clerkId)
 * @property {string} [name] - The name of the tenant
 * @property {string} [status] - The status of the tenant
 */
export interface ITenantEnsureExistsQueryDto {
	clerkId: string;
	name?: string;
	status?: string;
}

