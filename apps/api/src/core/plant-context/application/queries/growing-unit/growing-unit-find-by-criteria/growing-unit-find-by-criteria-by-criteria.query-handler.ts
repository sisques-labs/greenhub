import {
  GROWING_UNIT_READ_REPOSITORY_TOKEN,
  IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GrowingUnitFindByCriteriaQuery } from './growing-unit-find-by-criteria.query';

/**
 * Handles the {@link GrowingUnitFindByCriteriaQuery} by retrieving growing unit view models
 * matching the specified criteria. Returns a paginated result set.
 *
 * @remarks
 * Implements the {@link IQueryHandler} interface for this specific query, using the injected
 * read repository for growing units.
 *
 * @see GrowingUnitViewModel
 * @see PaginatedResult
 */
@QueryHandler(GrowingUnitFindByCriteriaQuery)
export class GrowingUnitFindByCriteriaQueryHandler
  implements IQueryHandler<GrowingUnitFindByCriteriaQuery>
{
  /**
   * Standard NestJS logger, scoped to this handler.
   */
  private readonly logger = new Logger(
    GrowingUnitFindByCriteriaQueryHandler.name,
  );

  /**
   * Constructor for GrowingUnitFindByCriteriaQueryHandler.
   *
   * @param growingUnitReadRepository - The repository instance used to access growing unit data.
   */
  constructor(
    @Inject(GROWING_UNIT_READ_REPOSITORY_TOKEN)
    private readonly growingUnitReadRepository: IGrowingUnitReadRepository,
  ) {}

  /**
   * Executes the {@link GrowingUnitFindByCriteriaQuery} query.
   *
   * @param query - The query object containing the criteria for filtering growing units.
   * @returns A {@link PaginatedResult} of {@link GrowingUnitViewModel} matching the criteria.
   */
  async execute(
    query: GrowingUnitFindByCriteriaQuery,
  ): Promise<PaginatedResult<GrowingUnitViewModel>> {
    this.logger.log(
      `Executing growing unit find by criteria query: ${JSON.stringify(query.criteria)}`,
    );

    return await this.growingUnitReadRepository.findByCriteria(query.criteria);
  }
}
