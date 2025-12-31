import { Logger } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { AssertSagaInstanceViewModelExistsService } from "@/generic/saga-context/saga-instance/application/services/assert-saga-instance-view-model-exists/assert-saga-instance-view-model-exists.service";
import { SagaInstanceViewModel } from "@/generic/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model";
import { FindSagaInstanceViewModelByIdQuery } from "./saga-instance-view-model-find-by-id.query";

@QueryHandler(FindSagaInstanceViewModelByIdQuery)
export class FindSagaInstanceViewModelByIdQueryHandler
	implements IQueryHandler<FindSagaInstanceViewModelByIdQuery>
{
	private readonly logger = new Logger(
		FindSagaInstanceViewModelByIdQueryHandler.name,
	);

	constructor(
		private readonly assertSagaInstanceViewModelExistsService: AssertSagaInstanceViewModelExistsService,
	) {}

	/**
	 * Executes the FindSagaInstanceViewModelByIdQuery query.
	 *
	 * @param query - The FindSagaInstanceViewModelByIdQuery query to execute.
	 * @returns The SagaInstanceViewModel if found.
	 */
	async execute(
		query: FindSagaInstanceViewModelByIdQuery,
	): Promise<SagaInstanceViewModel> {
		this.logger.log(
			`Executing find saga instance view model by id query: ${query.id.value}`,
		);

		// 01: Assert the saga instance view model exists
		return await this.assertSagaInstanceViewModelExistsService.execute(
			query.id.value,
		);
	}
}
