import { Inject, Injectable, Logger } from '@nestjs/common';

import { TenantNotFoundException } from '@/generic/tenants/application/exceptions/tenant-not-found/tenant-not-found.exception';
import {
	TENANT_READ_REPOSITORY_TOKEN,
	ITenantReadRepository,
} from '@/generic/tenants/domain/repositories/tenant-read/tenant-read.repository';
import { TenantViewModel } from '@/generic/tenants/domain/view-models/tenant/tenant.view-model';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';

@Injectable()
export class AssertTenantViewModelExistsService
	implements IBaseService<string, TenantViewModel>
{
	private readonly logger = new Logger(
		AssertTenantViewModelExistsService.name,
	);

	constructor(
		@Inject(TENANT_READ_REPOSITORY_TOKEN)
		private readonly tenantReadRepository: ITenantReadRepository,
	) {}

	/**
	 * Asserts that a tenant view model exists by id.
	 *
	 * @param id - The tenant id
	 * @returns The tenant view model if found
	 * @throws {TenantNotFoundException} If the tenant view model does not exist
	 */
	async execute(id: string): Promise<TenantViewModel> {
		this.logger.log(`Asserting tenant view model exists by id: ${id}`);

		// 01: Find the tenant view model by id
		const existingTenantViewModel =
			await this.tenantReadRepository.findById(id);

		// 02: If the tenant view model does not exist, throw an error
		if (!existingTenantViewModel) {
			this.logger.error(`Tenant view model not found by id: ${id}`);
			throw new TenantNotFoundException(id);
		}

		return existingTenantViewModel;
	}
}

