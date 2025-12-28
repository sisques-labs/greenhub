import { ContainerNotFoundException } from '@/core/plant-context/containers/application/exceptions/container-not-found/container-not-found.exception';
import {
  CONTAINER_READ_REPOSITORY_TOKEN,
  ContainerReadRepository,
} from '@/core/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

/**
 * Service responsible for asserting that a container view model exists in the read repository.
 *
 * @remarks
 * This service encapsulates the logic for verifying container view model existence and throwing
 * appropriate exceptions when a container view model is not found.
 */
@Injectable()
export class AssertContainerViewModelExistsService
  implements IBaseService<string, ContainerViewModel>
{
  private readonly logger = new Logger(
    AssertContainerViewModelExistsService.name,
  );

  constructor(
    @Inject(CONTAINER_READ_REPOSITORY_TOKEN)
    private readonly containerReadRepository: ContainerReadRepository,
  ) {}

  /**
   * Asserts that a container view model exists by its ID.
   *
   * @param id - The container identifier
   * @returns The container view model if found
   * @throws {ContainerNotFoundException} If the container view model does not exist
   */
  async execute(id: string): Promise<ContainerViewModel> {
    this.logger.log(`Asserting container view model exists by id: ${id}`);

    // 01: Find the container view model by id
    const existingContainerViewModel =
      await this.containerReadRepository.findById(id);

    // 02: If the container view model does not exist, throw an error
    if (!existingContainerViewModel) {
      this.logger.error(`Container view model not found by id: ${id}`);
      throw new ContainerNotFoundException(id);
    }

    return existingContainerViewModel;
  }
}
