import { AssertContainerViewModelExistsService } from '@/core/plant-context/containers/application/services/assert-container-view-model-exists/assert-container-view-model-exists.service';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ContainerViewModelFindByIdQuery } from './container-view-model-find-by-id.query';

/**
 * Query handler for finding a container view model by id.
 *
 * @remarks
 * This handler executes the query to retrieve a container view model by its id.
 */
@QueryHandler(ContainerViewModelFindByIdQuery)
export class ContainerViewModelFindByIdQueryHandler
  implements IQueryHandler<ContainerViewModelFindByIdQuery>
{
  private readonly logger = new Logger(
    ContainerViewModelFindByIdQueryHandler.name,
  );

  constructor(
    private readonly assertContainerViewModelExistsService: AssertContainerViewModelExistsService,
  ) {}

  /**
   * Executes the ContainerViewModelFindByIdQuery query.
   *
   * @param query - The ContainerViewModelFindByIdQuery query to execute
   * @returns The ContainerViewModel if found
   */
  async execute(
    query: ContainerViewModelFindByIdQuery,
  ): Promise<ContainerViewModel> {
    this.logger.log(
      `Executing container view model find by id query: ${query.id.value}`,
    );

    // 01: Find the container view model by id
    return await this.assertContainerViewModelExistsService.execute(
      query.id.value,
    );
  }
}
