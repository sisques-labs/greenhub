import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { TenantViewModelBuilder } from '@/generic/tenants/domain/builders/tenant-view-model/tenant-view-model.builder';
import {
	TENANT_READ_REPOSITORY_TOKEN,
	ITenantReadRepository,
} from '@/generic/tenants/domain/repositories/tenant-read/tenant-read.repository';
import { TenantViewModel } from '@/generic/tenants/domain/view-models/tenant/tenant.view-model';
import { TenantCreatedEvent } from '@/shared/domain/events/tenants/tenant-created/tenant-created.event';

@EventsHandler(TenantCreatedEvent)
export class TenantCreatedEventHandler
	implements IEventHandler<TenantCreatedEvent>
{
	private readonly logger = new Logger(TenantCreatedEventHandler.name);

	constructor(
		@Inject(TENANT_READ_REPOSITORY_TOKEN)
		private readonly tenantReadRepository: ITenantReadRepository,
		private readonly tenantViewModelBuilder: TenantViewModelBuilder,
	) {}

	/**
	 * Handles the TenantCreatedEvent event by creating a new tenant view model.
	 *
	 * @param event - The TenantCreatedEvent event to handle.
	 */
	async handle(event: TenantCreatedEvent) {
		this.logger.log(`Handling tenant created event: ${event.aggregateRootId}`);

		this.logger.debug(
			`Tenant created event data: ${JSON.stringify(event.data)}`,
		);

		// 01: Create the tenant view model
		const tenantCreatedViewModel: TenantViewModel =
			this.tenantViewModelBuilder
				.reset()
				.withId(event.data.id)
				.withClerkId(event.data.clerkId)
				.withName(event.data.name)
				.withStatus(event.data.status)
				.build();

		// 02: Save the tenant view model
		await this.tenantReadRepository.save(tenantCreatedViewModel);
	}
}

