import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { AssertSagaLogNotExistsService } from '@/generic/saga-context/saga-log/application/services/assert-saga-log-not-exists/assert-saga-log-not-exists.service';
import { SagaLogAggregate } from '@/generic/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import { SagaLogAggregateFactory } from '@/generic/saga-context/saga-log/domain/factories/saga-log-aggregate/saga-log-aggregate.factory';
import {
	SAGA_LOG_WRITE_REPOSITORY_TOKEN,
	SagaLogWriteRepository,
} from '@/generic/saga-context/saga-log/domain/repositories/saga-log-write.repository';
import { BaseCommandHandler } from '@/shared/application/commands/base/base-command.handler';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';

import { SagaLogCreateCommand } from './saga-log-create.command';

@CommandHandler(SagaLogCreateCommand)
export class SagaLogCreateCommandHandler
	extends BaseCommandHandler<SagaLogCreateCommand, SagaLogAggregate>
	implements ICommandHandler<SagaLogCreateCommand>
{
	private readonly logger = new Logger(SagaLogCreateCommandHandler.name);

	constructor(
		@Inject(SAGA_LOG_WRITE_REPOSITORY_TOKEN)
		private readonly sagaLogWriteRepository: SagaLogWriteRepository,
		eventBus: EventBus,
		private readonly sagaLogAggregateFactory: SagaLogAggregateFactory,
		private readonly assertSagaLogNotExistsService: AssertSagaLogNotExistsService,
	) {
		super(eventBus);
	}

	/**
	 * Executes the saga log create command
	 *
	 * @param command - The command to execute
	 * @returns The created saga log id
	 */
	async execute(command: SagaLogCreateCommand): Promise<string> {
		this.logger.log(
			`Executing saga log create command with id ${command.id.value}`,
		);

		// 01: Assert the saga log is not exists
		await this.assertSagaLogNotExistsService.execute(command.id.value);

		// 02: Create the saga log entity
		const sagaLog = this.sagaLogAggregateFactory.create({
			...command,
			createdAt: new DateValueObject(new Date()),
			updatedAt: new DateValueObject(new Date()),
		});

		// 03: Save the saga log entity
		await this.sagaLogWriteRepository.save(sagaLog);

		// 04: Publish all events
		await this.publishDomainEvents(sagaLog);

		// 05: Return the saga log id
		return sagaLog.id.value;
	}
}
