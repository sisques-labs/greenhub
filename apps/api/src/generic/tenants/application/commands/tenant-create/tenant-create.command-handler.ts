import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { TenantAggregate } from '@/generic/tenants/domain/aggregates/tenant.aggregate';
import { TenantAggregateFactory } from '@/generic/tenants/domain/factories/aggregates/tenant-aggregate/tenant-aggregate.factory';
import {
	ITenantWriteRepository,
	TENANT_WRITE_REPOSITORY_TOKEN,
} from '@/generic/tenants/domain/repositories/tenant-write/tenant-write.repository';
import { TenantCreatedEvent } from '@/shared/domain/events/tenants/tenant-created/tenant-created.event';

import { TenantCreateCommand } from './tenant-create.command';

@CommandHandler(TenantCreateCommand)
export class TenantCreateCommandHandler
	implements ICommandHandler<TenantCreateCommand>
{
	private readonly logger = new Logger(TenantCreateCommandHandler.name);

	constructor(
		@Inject(TENANT_WRITE_REPOSITORY_TOKEN)
		private readonly tenantWriteRepository: ITenantWriteRepository,
		private readonly eventBus: EventBus,
		private readonly tenantAggregateFactory: TenantAggregateFactory,
	) {}

	/**
	 * Executes the tenant create command
	 *
	 * @param command - The command to execute
	 * @returns The created tenant id
	 */
	async execute(command: TenantCreateCommand): Promise<string> {
		this.logger.log(`Executing tenant create command: ${command.id.value}`);

		// 01: Create the tenant entity
		const tenant = this.tenantAggregateFactory.create({
			...command,
		});

		// 02: Save the tenant entity
		await this.tenantWriteRepository.save(tenant);

		// 03: Publish all events
		await this.eventBus.publishAll(tenant.getUncommittedEvents());

		// 04: Publish the TenantCreatedEvent
		await this.eventBus.publish(
			new TenantCreatedEvent(
				{
					aggregateRootId: tenant.id.value,
					aggregateRootType: TenantAggregate.name,
					entityId: tenant.id.value,
					entityType: TenantAggregate.name,
					eventType: TenantCreatedEvent.name,
				},
				tenant.toPrimitives(),
			),
		);

		// 05: Return the tenant id
		return tenant.id.value;
	}
}
