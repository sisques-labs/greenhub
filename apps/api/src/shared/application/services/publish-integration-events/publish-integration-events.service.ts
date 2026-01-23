import { Inject, Injectable, Logger } from '@nestjs/common';

import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import {
	IIntegrationEventPublisher,
	INTEGRATION_EVENT_PUBLISHER_TOKEN,
} from '@/shared/domain/interfaces/integration-event-publisher.interface';

/**
 * Service for publishing integration events across bounded contexts.
 * Delegates to IIntegrationEventPublisher abstraction to allow different transport mechanisms.
 */
@Injectable()
export class PublishIntegrationEventsService
	implements IBaseService<BaseEvent<unknown> | BaseEvent<unknown>[], void>
{
	private readonly logger = new Logger(PublishIntegrationEventsService.name);

	constructor(
		@Inject(INTEGRATION_EVENT_PUBLISHER_TOKEN)
		private readonly integrationEventPublisher: IIntegrationEventPublisher,
	) {}

	/**
	 * Publishes one or multiple integration events across bounded contexts.
	 *
	 * @param events - A single event or an array of events to publish
	 * @returns Promise that resolves when all events are published
	 */
	async execute(
		events: BaseEvent<unknown> | BaseEvent<unknown>[],
	): Promise<void> {
		// 01: Normalize events to array for logging
		const eventsArray = Array.isArray(events) ? events : [events];

		// 02: Log the events being published
		this.logger.log(
			`Publishing ${eventsArray.length} integration event(s)`,
		);

		// 03: Delegate to integration event publisher
		await this.integrationEventPublisher.publish(events);
	}
}
