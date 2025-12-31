import { Inject, Logger } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SagaStepAggregate } from "@/generic/saga-context/saga-step/domain/aggregates/saga-step.aggregate";
import {
	SAGA_STEP_WRITE_REPOSITORY_TOKEN,
	SagaStepWriteRepository,
} from "@/generic/saga-context/saga-step/domain/repositories/saga-step-write.repository";
import { FindSagaStepsBySagaInstanceIdQuery } from "./saga-step-find-by-saga-instance-id.query";

@QueryHandler(FindSagaStepsBySagaInstanceIdQuery)
export class FindSagaStepsBySagaInstanceIdQueryHandler
	implements IQueryHandler<FindSagaStepsBySagaInstanceIdQuery>
{
	private readonly logger = new Logger(
		FindSagaStepsBySagaInstanceIdQueryHandler.name,
	);

	constructor(
		@Inject(SAGA_STEP_WRITE_REPOSITORY_TOKEN)
		private readonly sagaStepWriteRepository: SagaStepWriteRepository,
	) {}

	/**
	 * Executes the FindSagaStepsBySagaInstanceIdQuery query.
	 *
	 * @param query - The FindSagaStepsBySagaInstanceIdQuery query to execute.
	 * @returns Array of SagaStepAggregates.
	 */
	async execute(
		query: FindSagaStepsBySagaInstanceIdQuery,
	): Promise<SagaStepAggregate[]> {
		this.logger.log(
			`Executing find saga steps by saga instance id query: ${query.sagaInstanceId.value}`,
		);

		// 01: Find the saga steps by saga instance id
		return this.sagaStepWriteRepository.findBySagaInstanceId(
			query.sagaInstanceId.value,
		);
	}
}
