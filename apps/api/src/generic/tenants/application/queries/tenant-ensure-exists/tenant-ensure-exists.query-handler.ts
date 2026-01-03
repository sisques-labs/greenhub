import { Logger } from '@nestjs/common';
import { CommandBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { TenantCreateCommand } from '@/generic/tenants/application/commands/tenant-create/tenant-create.command';
import { TenantEnsureExistsQuery } from '@/generic/tenants/application/queries/tenant-ensure-exists/tenant-ensure-exists.query';
import { TenantAggregate } from '@/generic/tenants/domain/aggregates/tenant.aggregate';
import {
	TENANT_WRITE_REPOSITORY_TOKEN,
	ITenantWriteRepository,
} from '@/generic/tenants/domain/repositories/tenant-write/tenant-write.repository';
import { TenantStatusEnum } from '@/generic/tenants/domain/enums/tenant-status/tenant-status.enum';
import { Inject } from '@nestjs/common';

/**
 * Query handler for ensuring a tenant exists (lazy creation).
 * Used for Clerk integration to create internal tenants on first authentication.
 */
@QueryHandler(TenantEnsureExistsQuery)
export class TenantEnsureExistsQueryHandler
	implements IQueryHandler<TenantEnsureExistsQuery>
{
	private readonly logger = new Logger(TenantEnsureExistsQueryHandler.name);

	constructor(
		@Inject(TENANT_WRITE_REPOSITORY_TOKEN)
		private readonly tenantWriteRepository: ITenantWriteRepository,
		private readonly commandBus: CommandBus,
	) {}

	/**
	 * Ensures a tenant exists, creating it if it doesn't.
	 *
	 * @param query - The query containing clerkId and tenant data from Clerk
	 * @returns The tenant aggregate (existing or newly created)
	 */
	async execute(query: TenantEnsureExistsQuery): Promise<TenantAggregate> {
		this.logger.log(
			`Ensuring tenant exists for Clerk organization: ${query.clerkId}`,
		);

		// 01: Check if tenant already exists by clerkId
		const existingTenant = await this.tenantWriteRepository.findByClerkId(
			query.clerkId,
		);

		if (existingTenant) {
			this.logger.log(`Tenant already exists: ${query.clerkId}`);
			return existingTenant;
		}

		// 02: Tenant doesn't exist, create it lazily
		this.logger.log(
			`Creating tenant lazily for Clerk organization: ${query.clerkId}`,
		);

		await this.commandBus.execute(
			new TenantCreateCommand({
				clerkId: query.clerkId,
				name: query.name || 'Unnamed Tenant',
				status: (query.status as TenantStatusEnum) || TenantStatusEnum.ACTIVE,
			}),
		);

		// 03: Fetch the newly created tenant
		const newTenant = await this.tenantWriteRepository.findByClerkId(
			query.clerkId,
		);

		if (!newTenant) {
			throw new Error(`Failed to create tenant: ${query.clerkId}`);
		}

		this.logger.log(`Tenant created successfully: ${query.clerkId}`);

		return newTenant;
	}
}

