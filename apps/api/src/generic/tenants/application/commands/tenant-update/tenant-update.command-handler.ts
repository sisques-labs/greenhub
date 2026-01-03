import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { TenantUpdateCommand } from '@/generic/tenants/application/commands/tenant-update/tenant-update.command';
import { AssertTenantExistsService } from '@/generic/tenants/application/services/assert-tenant-exists/assert-tenant-exists.service';
import { TenantAggregate } from '@/generic/tenants/domain/aggregates/tenant.aggregate';
import {
	ITenantWriteRepository,
	TENANT_WRITE_REPOSITORY_TOKEN,
} from '@/generic/tenants/domain/repositories/tenant-write/tenant-write.repository';
import { TenantUpdatedEvent } from '@/shared/domain/events/tenants/tenant-updated/tenant-updated.event';

@CommandHandler(TenantUpdateCommand)
export class TenantUpdateCommandHandler
	implements ICommandHandler<TenantUpdateCommand>
{
	private readonly logger = new Logger(TenantUpdateCommandHandler.name);

	constructor(
		@Inject(TENANT_WRITE_REPOSITORY_TOKEN)
		private readonly tenantWriteRepository: ITenantWriteRepository,
		private readonly eventBus: EventBus,
		private readonly assertTenantExistsService: AssertTenantExistsService,
	) {}

	/**
	 * Executes the update tenant command
	 *
	 * @param command - The command to execute
	 */
	async execute(command: TenantUpdateCommand): Promise<void> {
		this.logger.log(
			`Executing update tenant command by id: ${command.id.value}`,
		);

		// 01: Check if the tenant exists
		const existingTenant = await this.assertTenantExistsService.execute(
			command.id.value,
		);

		// 02: Update tenant properties if new values are provided
		if (command.name !== undefined) {
			existingTenant.changeName(command.name);
		}

		if (command.status !== undefined) {
			existingTenant.changeStatus(command.status);
		}

		// 03: Save the tenant
		await this.tenantWriteRepository.save(existingTenant);

		// 04: Publish all domain events
		await this.eventBus.publishAll(existingTenant.getUncommittedEvents());
		await existingTenant.commit();

		// 05: Publish the TenantUpdatedEvent
		await this.eventBus.publish(
			new TenantUpdatedEvent(
				{
					aggregateRootId: existingTenant.id.value,
					aggregateRootType: TenantAggregate.name,
					entityId: existingTenant.id.value,
					entityType: TenantAggregate.name,
					eventType: TenantUpdatedEvent.name,
				},
				existingTenant.toPrimitives(),
			),
		);
	}
}
