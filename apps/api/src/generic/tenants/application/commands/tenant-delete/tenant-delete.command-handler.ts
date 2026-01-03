import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { TenantDeleteCommand } from '@/generic/tenants/application/commands/tenant-delete/tenant-delete.command';
import { AssertTenantExistsService } from '@/generic/tenants/application/services/assert-tenant-exists/assert-tenant-exists.service';
import { TenantAggregate } from '@/generic/tenants/domain/aggregates/tenant.aggregate';
import {
	ITenantWriteRepository,
	TENANT_WRITE_REPOSITORY_TOKEN,
} from '@/generic/tenants/domain/repositories/tenant-write/tenant-write.repository';
import { TenantDeletedEvent } from '@/shared/domain/events/tenants/tenant-deleted/tenant-deleted.event';

@CommandHandler(TenantDeleteCommand)
export class TenantDeleteCommandHandler
	implements ICommandHandler<TenantDeleteCommand>
{
	private readonly logger = new Logger(TenantDeleteCommandHandler.name);

	constructor(
		@Inject(TENANT_WRITE_REPOSITORY_TOKEN)
		private readonly tenantWriteRepository: ITenantWriteRepository,
		private readonly eventBus: EventBus,
		private readonly assertTenantExistsService: AssertTenantExistsService,
	) {}

	/**
	 * Executes the delete tenant command
	 *
	 * @param command - The command to execute
	 */
	async execute(command: TenantDeleteCommand): Promise<void> {
		this.logger.log(
			`Executing delete tenant command by id: ${command.id.value}`,
		);

		// 01: Find the tenant by id
		const existingTenant = await this.assertTenantExistsService.execute(
			command.id.value,
		);

		// 02: Save the tenant entity
		await this.tenantWriteRepository.save(existingTenant);

		// 03: Publish all domain events
		await this.eventBus.publishAll(existingTenant.getUncommittedEvents());
		await existingTenant.commit();

		// 04: Publish the TenantDeletedEvent
		await this.eventBus.publish(
			new TenantDeletedEvent(
				{
					aggregateRootId: existingTenant.id.value,
					aggregateRootType: TenantAggregate.name,
					entityId: existingTenant.id.value,
					entityType: TenantAggregate.name,
					eventType: TenantDeletedEvent.name,
				},
				existingTenant.toPrimitives(),
			),
		);

		// 06: Delete the tenant from repository
		await this.tenantWriteRepository.delete(existingTenant.id.value);
	}
}
