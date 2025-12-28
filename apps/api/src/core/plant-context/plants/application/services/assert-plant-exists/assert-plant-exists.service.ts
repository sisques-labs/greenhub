import { PlantNotFoundException } from '@/core/plant-context/plants/application/exceptions/plant-not-found/plant-not-found.exception';
import { PlantAggregate } from '@/core/plant-context/plants/domain/aggregates/plant.aggregate';
import {
  PLANT_WRITE_REPOSITORY_TOKEN,
  PlantWriteRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-write/plant-write.repository';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

/**
 * Service responsible for asserting that a plant exists in the write repository.
 *
 * @remarks
 * This service encapsulates the logic for verifying plant existence and throwing
 * appropriate exceptions when a plant is not found.
 */
@Injectable()
export class AssertPlantExistsService
  implements IBaseService<string, PlantAggregate>
{
  private readonly logger = new Logger(AssertPlantExistsService.name);

  constructor(
    @Inject(PLANT_WRITE_REPOSITORY_TOKEN)
    private readonly plantWriteRepository: PlantWriteRepository,
  ) {}

  /**
   * Asserts that a plant exists by its ID.
   *
   * @param id - The plant identifier
   * @returns The plant aggregate if found
   * @throws {PlantNotFoundException} If the plant does not exist
   */
  async execute(id: string): Promise<PlantAggregate> {
    this.logger.log(`Asserting plant exists by id: ${id}`);

    const existingPlant = await this.plantWriteRepository.findById(id);

    if (!existingPlant) {
      this.logger.error(`Plant not found by id: ${id}`);
      throw new PlantNotFoundException(id);
    }

    return existingPlant;
  }
}
