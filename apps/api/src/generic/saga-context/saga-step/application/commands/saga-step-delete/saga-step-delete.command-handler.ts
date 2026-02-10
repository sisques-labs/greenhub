import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { SagaStepDeleteCommand } from '@/generic/saga-context/saga-step/application/commands/saga-step-delete/saga-step-delete.command';
import { AssertSagaStepExistsService } from '@/generic/saga-context/saga-step/application/services/assert-saga-step-exists/assert-saga-step-exists.service';
import { SagaStepAggregate } from '@/generic/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import {
	SAGA_STEP_WRITE_REPOSITORY_TOKEN,
	SagaStepWriteRepository,
} from '@/generic/saga-context/saga-step/domain/repositories/saga-step-write.repository';
import { BaseCommandHandler } from '@/shared/application/commands/base/base-command.handler';

@CommandHandler(SagaStepDeleteCommand)
export class SagaStepDeleteCommandHandler
	extends BaseCommandHandler<SagaStepDeleteCommand, SagaStepAggregate>
	implements ICommandHandler<SagaStepDeleteCommand>
{
	private readonly logger = new Logger(SagaStepDeleteCommandHandler.name);

	constructor(
		@Inject(SAGA_STEP_WRITE_REPOSITORY_TOKEN)
		private readonly sagaStepWriteRepository: SagaStepWriteRepository,
		eventBus: EventBus,
		private readonly assertSagaStepExistsService: AssertSagaStepExistsService,
	) {
		super(eventBus);
	}

	/**
	 * Executes the saga step delete command.
	 *
	 * @param command - The command to execute.
	 * @returns The void.
	 */
	async execute(command: SagaStepDeleteCommand): Promise<void> {
		this.logger.log(
			`Executing remove saga step command by id: ${command.id.value}`,
		);

		// 01: Check if the saga step exists
		const existingSagaStep = await this.assertSagaStepExistsService.execute(
			command.id.value,
		);

		// 02: Delete the saga step
		await existingSagaStep.delete();

		// 03: Delete the saga step from the repository
		await this.sagaStepWriteRepository.delete(existingSagaStep.id.value);

		// 04: Publish the saga step deleted event
		await this.publishEvents(existingSagaStep);
	}
}
