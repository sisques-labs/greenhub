import type { TenantClerkIdValueObject } from '@/generic/tenants/domain/value-objects/tenant-clerk-id/tenant-clerk-id.vo';
import type { TenantNameValueObject } from '@/generic/tenants/domain/value-objects/tenant-name/tenant-name.vo';
import type { TenantStatusValueObject } from '@/generic/tenants/domain/value-objects/tenant-status/tenant-status.vo';
import type { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';

/**
 * Represents the structure required to create a new tenant entity.
 *
 * @remarks
 * This interface defines the contract for all properties needed to instantiate a new Tenant entity in the system.
 *
 * @public
 */
export interface ITenantDto {
	id: TenantUuidValueObject;
	clerkId: TenantClerkIdValueObject;
	name: TenantNameValueObject;
	status: TenantStatusValueObject;
}
