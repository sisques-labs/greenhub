import { AggregateRoot, EventBus } from '@nestjs/cqrs';

/**
 * Base command handler class that provides common functionality for event publishing.
 *
 * @remarks
 * This abstract class encapsulates the pattern of publishing domain events and committing aggregates,
 * eliminating duplicate code across command handlers.
 *
 * @typeParam TCommand - The command type this handler processes
 * @typeParam TAggregate - The aggregate type (must extend AggregateRoot)
 *
 * @public
 */
export abstract class BaseCommandHandler<
	TCommand,
	TAggregate extends AggregateRoot,
> {
	/**
	 * Creates an instance of BaseCommandHandler.
	 *
	 * @param eventBus - The event bus for publishing domain events
	 */
	constructor(protected readonly eventBus: EventBus) {}

	/**
	 * Publishes all uncommitted domain events from an aggregate and commits the aggregate.
	 *
	 * @remarks
	 * This method encapsulates the common pattern of:
	 * 1. Publishing all uncommitted domain events via EventBus
	 * 2. Committing the aggregate to clear uncommitted events
	 *
	 * @param aggregate - The aggregate whose events should be published
	 * @returns A promise that resolves when events are published and aggregate is committed
	 *
	 * @example
	 * ```typescript
	 * const user = this.userFactory.create(command);
	 * await this.repository.save(user);
	 * await this.publishEvents(user);
	 * return user.id.value;
	 * ```
	 */
	protected async publishEvents(aggregate: TAggregate): Promise<void> {
		await this.eventBus.publishAll(aggregate.getUncommittedEvents());
		await aggregate.commit();
	}
}
