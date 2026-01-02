import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { SagaLogCreateCommand } from '@/generic/saga-context/saga-log/application/commands/saga-log-create/saga-log-create.command';
import { SagaLogTypeEnum } from '@/generic/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaInstanceUpdatedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-updated/saga-instance-updated.event';

@EventsHandler(SagaInstanceUpdatedEvent)
export class SagaInstanceUpdatedEventHandler
	implements IEventHandler<SagaInstanceUpdatedEvent>
{
	private readonly logger = new Logger(SagaInstanceUpdatedEventHandler.name);

	constructor(private readonly commandBus: CommandBus) {}

	/**
	 * Handles the SagaInstanceUpdatedEvent event by creating a saga log.
	 *
	 * @param event - The SagaInstanceUpdatedEvent event to handle.
	 */
	async handle(event: SagaInstanceUpdatedEvent) {
		this.logger.log(
			`Handling saga instance updated event: ${event.aggregateRootId}`,
		);

		// 01: Create a saga log for the saga instance update
		const updatedFields = Object.keys(event.data)
			.filter((key) => event.data[key] !== undefined)
			.join(', ');

		await this.commandBus.execute(
			new SagaLogCreateCommand({
				sagaInstanceId: event.aggregateRootId,
				sagaStepId: event.aggregateRootId,
				type: SagaLogTypeEnum.INFO,
				message: `Saga instance updated. Changed fields: ${updatedFields}`,
			}),
		);
	}
}
