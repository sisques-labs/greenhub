import { BaseEvent } from '@/shared/domain/events/base-event.interface';

/**
 * Interface for publishing integration events across bounded contexts.
 * Provides an abstraction layer that allows changing the underlying transport mechanism
 * (EventBus, Kafka, RabbitMQ, etc.) without modifying business logic.
 */
export interface IIntegrationEventPublisher {
	/**
	 * Publishes one or multiple integration events.
	 *
	 * @param events - A single event or an array of events to publish
	 * @returns Promise that resolves when all events are published
	 */
	publish(events: BaseEvent<unknown> | BaseEvent<unknown>[]): Promise<void>;
}

/**
 * Dependency injection token for IIntegrationEventPublisher.
 */
export const INTEGRATION_EVENT_PUBLISHER_TOKEN = Symbol(
	'IntegrationEventPublisher',
);
