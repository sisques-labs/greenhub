import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { SagaInstanceDeleteCommand } from '@/generic/saga-context/saga-instance/application/commands/saga-instance-delete/saga-instance-delete.command';
import { AssertSagaInstanceExistsService } from '@/generic/saga-context/saga-instance/application/services/assert-saga-instance-exists/assert-saga-instance-exists.service';
import { SagaInstanceAggregate } from '@/generic/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import {
	SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN,
	SagaInstanceWriteRepository,
} from '@/generic/saga-context/saga-instance/domain/repositories/saga-instance-write.repository';
import { BaseCommandHandler } from '@/shared/application/commands/base/base-command.handler';

@CommandHandler(SagaInstanceDeleteCommand)
export class SagaInstanceDeleteCommandHandler
	extends BaseCommandHandler<SagaInstanceDeleteCommand, SagaInstanceAggregate>
	implements ICommandHandler<SagaInstanceDeleteCommand>
{
	private readonly logger = new Logger(SagaInstanceDeleteCommandHandler.name);

	constructor(
		@Inject(SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN)
		private readonly sagaInstanceWriteRepository: SagaInstanceWriteRepository,
		eventBus: EventBus,
		private readonly assertSagaInstanceExistsService: AssertSagaInstanceExistsService,
	) {
		super(eventBus);
	}

	/**
	 * Executes the saga instance delete command.
	 *
	 * @param command - The command to execute.
	 * @returns The void.
	 */
	async execute(command: SagaInstanceDeleteCommand): Promise<void> {
		this.logger.log(
			`Executing remove saga instance command by id: ${command.id}`,
		);

		// 01: Check if the saga instance exists
		const existingSagaInstance =
			await this.assertSagaInstanceExistsService.execute(command.id.value);

		// 02: Delete the saga instance
		await existingSagaInstance.delete();

		// 04: Delete the saga instance from the repository
		await this.sagaInstanceWriteRepository.delete(
			existingSagaInstance.id.value,
		);

		// 05: Publish the saga instance deleted event
		await this.publishDomainEvents(existingSagaInstance);
	}
}
