import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { TenantNotFoundException } from '@/generic/tenants/application/exceptions/tenant-not-found/tenant-not-found.exception';
import {
	TENANT_READ_REPOSITORY_TOKEN,
	ITenantReadRepository,
} from '@/generic/tenants/domain/repositories/tenant-read/tenant-read.repository';
import { TenantViewModel } from '@/generic/tenants/domain/view-models/tenant/tenant.view-model';
import { TenantDeletedEvent } from '@/shared/domain/events/tenants/tenant-deleted/tenant-deleted.event';

@EventsHandler(TenantDeletedEvent)
export class TenantDeletedEventHandler
	implements IEventHandler<TenantDeletedEvent>
{
	private readonly logger = new Logger(TenantDeletedEventHandler.name);

	constructor(
		@Inject(TENANT_READ_REPOSITORY_TOKEN)
		private readonly tenantReadRepository: ITenantReadRepository,
	) {}

	/**
	 * Handles the TenantDeletedEvent event by deleting the existing tenant view model.
	 *
	 * @param event - The TenantDeletedEvent event to handle.
	 */
	async handle(event: TenantDeletedEvent) {
		this.logger.log(`Handling tenant deleted event: ${event.aggregateRootId}`);

		// 01: Find the existing tenant view model by id
		const existingTenantViewModel: TenantViewModel | null =
			await this.tenantReadRepository.findById(event.aggregateRootId);

		// 02: If the tenant does not exist, throw an error
		if (!existingTenantViewModel) {
			this.logger.error(
				`Tenant not found by id: ${event.aggregateRootId}`,
			);
			throw new TenantNotFoundException(event.aggregateRootId);
		}

		// 03: Delete the tenant view model
		await this.tenantReadRepository.delete(existingTenantViewModel.id);
	}
}

