import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { TenantViewModelFindByIdQuery } from '@/generic/tenants/application/queries/tenant-view-model-find-by-id/tenant-view-model-find-by-id.query';
import { AssertTenantViewModelExistsService } from '@/generic/tenants/application/services/assert-tenant-view-model-exists/assert-tenant-view-model-exists.service';
import { TenantViewModel } from '@/generic/tenants/domain/view-models/tenant/tenant.view-model';

@QueryHandler(TenantViewModelFindByIdQuery)
export class TenantViewModelFindByIdQueryHandler
	implements IQueryHandler<TenantViewModelFindByIdQuery>
{
	private readonly logger = new Logger(
		TenantViewModelFindByIdQueryHandler.name,
	);

	constructor(
		private readonly assertTenantViewModelExistsService: AssertTenantViewModelExistsService,
	) {}

	/**
	 * Executes the TenantViewModelFindByIdQuery query.
	 *
	 * @param query - The TenantViewModelFindByIdQuery query to execute.
	 * @returns The TenantViewModel if found.
	 */
	async execute(
		query: TenantViewModelFindByIdQuery,
	): Promise<TenantViewModel> {
		this.logger.log(
			`Executing tenant view model find by id query: ${query.id.value}`,
		);

		// 01: Find the tenant view model by id
		return await this.assertTenantViewModelExistsService.execute(
			query.id.value,
		);
	}
}

