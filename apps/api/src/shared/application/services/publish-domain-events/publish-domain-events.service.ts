import { IEvent } from '@nestjs/cqrs';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import {
	DOMAIN_EVENT_PUBLISHER_TOKEN,
	IDomainEventPublisher,
} from '@/shared/domain/interfaces/domain-event-publisher.interface';

/**
 * Service for publishing domain events within a bounded context.
 * Delegates to IDomainEventPublisher abstraction to allow different transport mechanisms.
 */
@Injectable()
export class PublishDomainEventsService
	implements IBaseService<IEvent[], void>
{
	private readonly logger = new Logger(PublishDomainEventsService.name);

	constructor(
		@Inject(DOMAIN_EVENT_PUBLISHER_TOKEN)
		private readonly domainEventPublisher: IDomainEventPublisher,
	) {}

	/**
	 * Publishes domain events from an aggregate's uncommitted events.
	 *
	 * @param events - Array of domain events to publish
	 * @returns Promise that resolves when all events are published
	 */
	async execute(events: IEvent[]): Promise<void> {
		// 01: Log the events being published
		if (events.length > 0) {
			this.logger.log(`Publishing ${events.length} domain event(s)`);
		}

		// 02: Delegate to domain event publisher
		await this.domainEventPublisher.publishAll(events);
	}
}
