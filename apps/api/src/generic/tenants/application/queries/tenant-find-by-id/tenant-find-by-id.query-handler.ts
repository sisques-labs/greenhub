import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { TenantFindByIdQuery } from '@/generic/tenants/application/queries/tenant-find-by-id/tenant-find-by-id.query';
import { AssertTenantExistsService } from '@/generic/tenants/application/services/assert-tenant-exists/assert-tenant-exists.service';
import { TenantAggregate } from '@/generic/tenants/domain/aggregates/tenant.aggregate';

@QueryHandler(TenantFindByIdQuery)
export class TenantFindByIdQueryHandler
	implements IQueryHandler<TenantFindByIdQuery>
{
	private readonly logger = new Logger(TenantFindByIdQueryHandler.name);

	constructor(
		private readonly assertTenantExistsService: AssertTenantExistsService,
	) {}

	/**
	 * Executes the TenantFindByIdQuery query.
	 *
	 * @param query - The TenantFindByIdQuery query to execute.
	 * @returns The TenantAggregate if found.
	 */
	async execute(query: TenantFindByIdQuery): Promise<TenantAggregate> {
		this.logger.log(`Executing tenant find by id query: ${query.id.value}`);

		// 01: Find the tenant by id
		return await this.assertTenantExistsService.execute(query.id.value);
	}
}

