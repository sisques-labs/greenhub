import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  SAGA_STEP_READ_REPOSITORY_TOKEN,
  SagaStepReadRepository,
} from '@/generic/saga-context/saga-step/domain/repositories/saga-step-read.repository';
import { SagaStepViewModel } from '@/generic/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { FindSagaStepViewModelsBySagaInstanceIdQuery } from './saga-step-find-view-model-by-saga-instance-id.query';

@QueryHandler(FindSagaStepViewModelsBySagaInstanceIdQuery)
export class FindSagaStepViewModelsBySagaInstanceIdQueryHandler
  implements IQueryHandler<FindSagaStepViewModelsBySagaInstanceIdQuery>
{
  private readonly logger = new Logger(
    FindSagaStepViewModelsBySagaInstanceIdQueryHandler.name,
  );

  constructor(
    @Inject(SAGA_STEP_READ_REPOSITORY_TOKEN)
    private readonly sagaStepReadRepository: SagaStepReadRepository,
  ) {}

  /**
   * Executes the FindSagaStepViewModelsBySagaInstanceIdQuery query.
   *
   * @param query - The FindSagaStepViewModelsBySagaInstanceIdQuery query to execute.
   * @returns Array of SagaStepViewModels.
   */
  async execute(
    query: FindSagaStepViewModelsBySagaInstanceIdQuery,
  ): Promise<SagaStepViewModel[]> {
    this.logger.log(
      `Executing find saga step view models by saga instance id query: ${query.sagaInstanceId.value}`,
    );

    // 01: Find the saga step view models by saga instance id
    return this.sagaStepReadRepository.findBySagaInstanceId(
      query.sagaInstanceId.value,
    );
  }
}
