import { ContainerNotFoundException } from '@/core/plant-context/containers/application/exceptions/container-not-found/container-not-found.exception';
import { ContainerAggregate } from '@/core/plant-context/containers/domain/aggregates/container.aggregate';
import {
  CONTAINER_WRITE_REPOSITORY_TOKEN,
  ContainerWriteRepository,
} from '@/core/plant-context/containers/domain/repositories/container-write/container-write.repository';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

/**
 * Service responsible for asserting that a container exists in the write repository.
 *
 * @remarks
 * This service encapsulates the logic for verifying container existence and throwing
 * appropriate exceptions when a container is not found.
 */
@Injectable()
export class AssertContainerExistsService
  implements IBaseService<string, ContainerAggregate>
{
  private readonly logger = new Logger(AssertContainerExistsService.name);

  constructor(
    @Inject(CONTAINER_WRITE_REPOSITORY_TOKEN)
    private readonly containerWriteRepository: ContainerWriteRepository,
  ) {}

  /**
   * Asserts that a container exists by its ID.
   *
   * @param id - The container identifier
   * @returns The container aggregate if found
   * @throws {ContainerNotFoundException} If the container does not exist
   */
  async execute(id: string): Promise<ContainerAggregate> {
    this.logger.log(`Asserting container exists by id: ${id}`);

    // 01: Find the container by id
    const existingContainer = await this.containerWriteRepository.findById(id);

    // 02: If the container does not exist, throw an error
    if (!existingContainer) {
      this.logger.error(`Container not found by id: ${id}`);
      throw new ContainerNotFoundException(id);
    }

    return existingContainer;
  }
}
