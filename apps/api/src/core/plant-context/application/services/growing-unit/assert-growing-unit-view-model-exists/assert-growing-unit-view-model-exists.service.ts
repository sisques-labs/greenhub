import { GrowingUnitNotFoundException } from '@/core/plant-context/application/exceptions/growing-unit/growing-unit-not-found/growing-unit-not-found.exception';
import {
  GROWING_UNIT_READ_REPOSITORY_TOKEN,
  IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

/**
 * Service responsible for asserting that a growing unit view model exists in the read repository.
 *
 * @remarks
 * This service provides a method to assert the existence of a growing unit view model
 * by its unique identifier. If the view model does not exist, an exception is thrown.
 *
 * @public
 */
@Injectable()
export class AssertGrowingUnitViewModelExistsService
  implements IBaseService<string, GrowingUnitViewModel>
{
  /**
   * Logger instance for this service.
   * @private
   */
  private readonly logger = new Logger(
    AssertGrowingUnitViewModelExistsService.name,
  );

  /**
   * Constructs the service.
   *
   * @param growingUnitReadRepository - Repository for reading growing unit view models
   */
  constructor(
    @Inject(GROWING_UNIT_READ_REPOSITORY_TOKEN)
    private readonly growingUnitReadRepository: IGrowingUnitReadRepository,
  ) {}

  /**
   * Asserts that a growing unit view model exists by its ID.
   *
   * @param id - The unique identifier of the growing unit.
   * @returns The {@link GrowingUnitViewModel} if found.
   * @throws {@link GrowingUnitNotFoundException} If the growing unit view model does not exist.
   */
  async execute(id: string): Promise<GrowingUnitViewModel> {
    this.logger.log(`Asserting growing unit view model exists by id: ${id}`);

    // Find the growing unit view model by id
    const existingGrowingUnitViewModel =
      await this.growingUnitReadRepository.findById(id);

    // If the growing unit view model does not exist, throw an error
    if (!existingGrowingUnitViewModel) {
      this.logger.error(`Growing unit view model not found by id: ${id}`);
      throw new GrowingUnitNotFoundException(id);
    }

    return existingGrowingUnitViewModel;
  }
}
