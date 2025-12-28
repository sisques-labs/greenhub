import {
  CONTAINER_READ_REPOSITORY_TOKEN,
  ContainerReadRepository,
} from '@/core/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindContainersByCriteriaQuery } from './find-containers-by-criteria.query';

/**
 * Query handler for finding containers by criteria.
 *
 * @remarks
 * This handler executes the query to retrieve paginated container view models based on criteria.
 */
@QueryHandler(FindContainersByCriteriaQuery)
export class FindContainersByCriteriaQueryHandler
  implements IQueryHandler<FindContainersByCriteriaQuery>
{
  private readonly logger = new Logger(
    FindContainersByCriteriaQueryHandler.name,
  );

  constructor(
    @Inject(CONTAINER_READ_REPOSITORY_TOKEN)
    private readonly containerReadRepository: ContainerReadRepository,
  ) {}

  /**
   * Executes the FindContainersByCriteriaQuery query.
   *
   * @param query - The FindContainersByCriteriaQuery query to execute
   * @returns Paginated result containing container view models
   */
  async execute(
    query: FindContainersByCriteriaQuery,
  ): Promise<PaginatedResult<ContainerViewModel>> {
    this.logger.log(
      `Executing find containers by criteria query: ${JSON.stringify(query.criteria)}`,
    );

    return await this.containerReadRepository.findByCriteria(query.criteria);
  }
}
