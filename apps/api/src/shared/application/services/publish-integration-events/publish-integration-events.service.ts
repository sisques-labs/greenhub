import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';

/**
 * Service for publishing integration events to the EventBus.
 * This service can publish one or multiple events at once.
 */
@Injectable()
export class PublishIntegrationEventsService
	implements IBaseService<BaseEvent<unknown> | BaseEvent<unknown>[], void>
{
	private readonly logger = new Logger(PublishIntegrationEventsService.name);

	constructor(private readonly eventBus: EventBus) {}

	/**
	 * Publishes one or multiple integration events to the EventBus.
	 *
	 * @param events - A single event or an array of events to publish
	 * @returns Promise that resolves when all events are published
	 */
	async execute(
		events: BaseEvent<unknown> | BaseEvent<unknown>[],
	): Promise<void> {
		// 01: Normalize events to array
		const eventsArray = Array.isArray(events) ? events : [events];

		// 02: Log the events being published
		this.logger.log(
			`Publishing ${eventsArray.length} integration event(s) to EventBus`,
		);

		eventsArray.forEach((event) => {
			this.logger.debug(
				`Publishing integration event: ${event.eventType} for aggregate ${event.aggregateRootId}`,
			);
		});

		// 03: Publish all events
		await this.eventBus.publishAll(eventsArray);
	}
}
