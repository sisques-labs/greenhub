import { Logger } from '@nestjs/common';
import {
	CommandBus,
	EventsHandler,
	IEventHandler,
	QueryBus,
} from '@nestjs/cqrs';

import { SagaLogCreateCommand } from '@/generic/saga-context/saga-log/application/commands/saga-log-create/saga-log-create.command';
import { SagaLogTypeEnum } from '@/generic/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { FindSagaStepViewModelByIdQuery } from '@/generic/saga-context/saga-step/application/queries/saga-step-find-view-model-by-id/saga-step-find-view-model-by-id.query';
import { SagaStepUpdatedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-updated/saga-step-updated.event';

@EventsHandler(SagaStepUpdatedEvent)
export class SagaStepUpdatedEventHandler
	implements IEventHandler<SagaStepUpdatedEvent>
{
	private readonly logger = new Logger(SagaStepUpdatedEventHandler.name);

	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	/**
	 * Handles the SagaStepUpdatedEvent event by creating a saga log.
	 *
	 * @param event - The SagaStepUpdatedEvent event to handle.
	 */
	async handle(event: SagaStepUpdatedEvent) {
		this.logger.log(
			`Handling saga step updated event: ${event.aggregateRootId}`,
		);

		// 01: Get the saga step to retrieve the sagaInstanceId
		const sagaStep = await this.queryBus.execute(
			new FindSagaStepViewModelByIdQuery({ id: event.aggregateRootId }),
		);

		// 02: Create a saga log for the saga step update
		const updatedFields = Object.keys(event.data)
			.filter((key) => event.data[key] !== undefined)
			.join(', ');

		await this.commandBus.execute(
			new SagaLogCreateCommand({
				sagaInstanceId: sagaStep.sagaInstanceId,
				sagaStepId: sagaStep.id,
				type: SagaLogTypeEnum.INFO,
				message: `Saga step updated. Changed fields: ${updatedFields}`,
			}),
		);
	}
}
