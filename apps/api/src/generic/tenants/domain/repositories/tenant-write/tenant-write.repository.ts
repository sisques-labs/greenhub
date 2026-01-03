import type { TenantAggregate } from '@/generic/tenants/domain/aggregates/tenant.aggregate';
import type { IBaseWriteRepository } from '@/shared/domain/interfaces/base-write-repository.interface';

export const TENANT_WRITE_REPOSITORY_TOKEN = Symbol('TenantWriteRepository');

/**
 * Write repository interface for Tenant aggregate.
 * Extends IBaseWriteRepository with additional query methods.
 */
export interface ITenantWriteRepository
	extends IBaseWriteRepository<TenantAggregate> {
	findByClerkId(clerkId: string): Promise<TenantAggregate | null>;
}
