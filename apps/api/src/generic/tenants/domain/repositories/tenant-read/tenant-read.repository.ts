import type { TenantViewModel } from '@/generic/tenants/domain/view-models/tenant/tenant.view-model';
import type { IBaseReadRepository } from '@/shared/domain/interfaces/base-read-repository.interface';

export const TENANT_READ_REPOSITORY_TOKEN = Symbol('TenantReadRepository');

/**
 * Type alias for the tenant read repository.
 * This repository handles read operations (queries) for tenants.
 *
 * @type ITenantReadRepository
 */
export type ITenantReadRepository = IBaseReadRepository<TenantViewModel>;
