import { Inject, Injectable, Logger } from '@nestjs/common';

import { TenantNotFoundException } from '@/generic/tenants/application/exceptions/tenant-not-found/tenant-not-found.exception';
import { TenantAggregate } from '@/generic/tenants/domain/aggregates/tenant.aggregate';
import {
	TENANT_WRITE_REPOSITORY_TOKEN,
	ITenantWriteRepository,
} from '@/generic/tenants/domain/repositories/tenant-write/tenant-write.repository';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';

@Injectable()
export class AssertTenantExistsService
	implements IBaseService<string, TenantAggregate>
{
	private readonly logger = new Logger(AssertTenantExistsService.name);

	constructor(
		@Inject(TENANT_WRITE_REPOSITORY_TOKEN)
		private readonly tenantWriteRepository: ITenantWriteRepository,
	) {}

	/**
	 * Asserts that a tenant exists by id.
	 *
	 * @param id - The tenant id
	 * @returns The tenant aggregate if found
	 * @throws {TenantNotFoundException} If the tenant does not exist
	 */
	async execute(id: string): Promise<TenantAggregate> {
		this.logger.log(`Asserting tenant exists by id: ${id}`);

		// 01: Find the tenant by id
		const existingTenant = await this.tenantWriteRepository.findById(id);

		// 02: If the tenant does not exist, throw an error
		if (!existingTenant) {
			this.logger.error(`Tenant not found by id: ${id}`);
			throw new TenantNotFoundException(id);
		}

		return existingTenant;
	}
}

