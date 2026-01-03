import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { AssertTenantViewModelExistsService } from '@/generic/tenants/application/services/assert-tenant-view-model-exists/assert-tenant-view-model-exists.service';
import {
	TENANT_READ_REPOSITORY_TOKEN,
	ITenantReadRepository,
} from '@/generic/tenants/domain/repositories/tenant-read/tenant-read.repository';
import { TenantUpdatedEvent } from '@/shared/domain/events/tenants/tenant-updated/tenant-updated.event';

@EventsHandler(TenantUpdatedEvent)
export class TenantUpdatedEventHandler
	implements IEventHandler<TenantUpdatedEvent>
{
	private readonly logger = new Logger(TenantUpdatedEventHandler.name);

	constructor(
		@Inject(TENANT_READ_REPOSITORY_TOKEN)
		private readonly tenantReadRepository: ITenantReadRepository,
		private readonly assertTenantViewModelExistsService: AssertTenantViewModelExistsService,
	) {}

	/**
	 * Handles the TenantUpdatedEvent event by updating the existing tenant view model.
	 *
	 * @param event - The TenantUpdatedEvent event to handle.
	 */
	async handle(event: TenantUpdatedEvent) {
		this.logger.log(`Handling tenant updated event: ${event.aggregateRootId}`);

		// 01: Assert the tenant view model exists
		const existingTenantViewModel =
			await this.assertTenantViewModelExistsService.execute(
				event.aggregateRootId,
			);

		// 02: Update the existing view model with new data
		existingTenantViewModel.update({
			id: event.data.id,
			clerkId: event.data.clerkId,
			name: event.data.name,
			status: event.data.status,
			createdAt: existingTenantViewModel.createdAt,
			updatedAt: existingTenantViewModel.updatedAt,
		});

		// 03: Save the updated tenant view model
		await this.tenantReadRepository.save(existingTenantViewModel);
	}
}

