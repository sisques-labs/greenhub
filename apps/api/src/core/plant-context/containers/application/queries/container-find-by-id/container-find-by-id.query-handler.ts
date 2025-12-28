import { AssertContainerExistsService } from '@/core/plant-context/containers/application/services/assert-container-exists/assert-container-exists.service';
import { ContainerAggregate } from '@/core/plant-context/containers/domain/aggregates/container.aggregate';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ContainerFindByIdQuery } from './container-find-by-id.query';

/**
 * Query handler for finding a container by id.
 *
 * @remarks
 * This handler executes the query to retrieve a container aggregate by its id.
 */
@QueryHandler(ContainerFindByIdQuery)
export class ContainerFindByIdQueryHandler
  implements IQueryHandler<ContainerFindByIdQuery>
{
  private readonly logger = new Logger(ContainerFindByIdQueryHandler.name);

  constructor(
    private readonly assertContainerExistsService: AssertContainerExistsService,
  ) {}

  /**
   * Executes the ContainerFindByIdQuery query.
   *
   * @param query - The ContainerFindByIdQuery query to execute
   * @returns The ContainerAggregate if found
   */
  async execute(query: ContainerFindByIdQuery): Promise<ContainerAggregate> {
    this.logger.log(`Executing container find by id query: ${query.id.value}`);

    // 01: Find the container by id
    return await this.assertContainerExistsService.execute(query.id.value);
  }
}
