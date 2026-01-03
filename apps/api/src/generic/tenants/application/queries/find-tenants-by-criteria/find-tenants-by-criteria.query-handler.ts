import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import {
	ITenantReadRepository,
	TENANT_READ_REPOSITORY_TOKEN,
} from '@/generic/tenants/domain/repositories/tenant-read/tenant-read.repository';
import { TenantViewModel } from '@/generic/tenants/domain/view-models/tenant/tenant.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

import { FindTenantsByCriteriaQuery } from './find-tenants-by-criteria.query';

@QueryHandler(FindTenantsByCriteriaQuery)
export class FindTenantsByCriteriaQueryHandler
	implements IQueryHandler<FindTenantsByCriteriaQuery>
{
	constructor(
		@Inject(TENANT_READ_REPOSITORY_TOKEN)
		private readonly tenantReadRepository: ITenantReadRepository,
	) {}

	async execute(
		query: FindTenantsByCriteriaQuery,
	): Promise<PaginatedResult<TenantViewModel>> {
		return this.tenantReadRepository.findByCriteria(query.criteria);
	}
}
