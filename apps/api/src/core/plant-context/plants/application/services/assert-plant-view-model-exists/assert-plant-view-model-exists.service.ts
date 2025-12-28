import { PlantNotFoundException } from '@/core/plant-context/plants/application/exceptions/plant-not-found/plant-not-found.exception';
import {
  PLANT_READ_REPOSITORY_TOKEN,
  PlantReadRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-read/plant-read.repository';
import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

/**
 * Service responsible for asserting that a plant view model exists in the read repository.
 *
 * @remarks
 * This service encapsulates the logic for verifying plant view model existence and throwing
 * appropriate exceptions when a plant view model is not found.
 */
@Injectable()
export class AssertPlantViewModelExistsService
  implements IBaseService<string, PlantViewModel>
{
  private readonly logger = new Logger(AssertPlantViewModelExistsService.name);

  constructor(
    @Inject(PLANT_READ_REPOSITORY_TOKEN)
    private readonly plantReadRepository: PlantReadRepository,
  ) {}

  /**
   * Asserts that a plant view model exists by its ID.
   *
   * @param id - The plant identifier
   * @returns The plant view model if found
   * @throws {PlantNotFoundException} If the plant view model does not exist
   */
  async execute(id: string): Promise<PlantViewModel> {
    this.logger.log(`Asserting plant view model exists by id: ${id}`);

    const existingPlantViewModel = await this.plantReadRepository.findById(id);

    if (!existingPlantViewModel) {
      this.logger.error(`Plant view model not found by id: ${id}`);
      throw new PlantNotFoundException(id);
    }

    return existingPlantViewModel;
  }
}
