import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IIntegrationEventPublisher } from '@/shared/domain/interfaces/integration-event-publisher.interface';

/**
 * EventBus implementation of IIntegrationEventPublisher.
 * Publishes integration events using NestJS CQRS EventBus for in-process event handling.
 */
@Injectable()
export class EventBusIntegrationEventPublisher
	implements IIntegrationEventPublisher
{
	private readonly logger = new Logger(EventBusIntegrationEventPublisher.name);

	constructor(private readonly eventBus: EventBus) {}

	/**
	 * Publishes one or multiple integration events to the EventBus.
	 *
	 * @param events - A single event or an array of events to publish
	 * @returns Promise that resolves when all events are published
	 */
	async publish(
		events: BaseEvent<unknown> | BaseEvent<unknown>[],
	): Promise<void> {
		// 01: Normalize events to array
		const eventsArray = Array.isArray(events) ? events : [events];

		// 02: Log the events being published
		this.logger.log(
			`Publishing ${eventsArray.length} integration event(s) via EventBus`,
		);

		eventsArray.forEach((event) => {
			this.logger.debug(
				`Publishing integration event: ${event.eventType} for aggregate ${event.aggregateRootId}`,
			);
		});

		// 03: Publish all events to EventBus
		await this.eventBus.publishAll(eventsArray);
	}
}
