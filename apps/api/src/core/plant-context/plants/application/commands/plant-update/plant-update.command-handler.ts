import { AssertPlantExistsService } from '@/core/plant-context/plants/application/services/assert-plant-exists/assert-plant-exists.service';
import {
  PLANT_WRITE_REPOSITORY_TOKEN,
  PlantWriteRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-write/plant-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PlantUpdateCommand } from './plant-update.command';

/**
 * Command handler for updating an existing plant.
 *
 * @remarks
 * This handler orchestrates the update of a plant aggregate, saves changes to the write repository,
 * and publishes domain events.
 */
@CommandHandler(PlantUpdateCommand)
export class PlantUpdateCommandHandler
  implements ICommandHandler<PlantUpdateCommand>
{
  private readonly logger = new Logger(PlantUpdateCommandHandler.name);

  constructor(
    @Inject(PLANT_WRITE_REPOSITORY_TOKEN)
    private readonly plantWriteRepository: PlantWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertPlantExistsService: AssertPlantExistsService,
  ) {}

  /**
   * Executes the plant update command.
   *
   * @param command - The command to execute
   * @returns void
   */
  async execute(command: PlantUpdateCommand): Promise<void> {
    this.logger.log(
      `Executing update plant command by id: ${command.id.value}`,
    );

    const existingPlant = await this.assertPlantExistsService.execute(
      command.id.value,
    );

    existingPlant.update(
      {
        name: command.name,
        species: command.species,
        plantedDate: command.plantedDate,
        notes: command.notes,
        status: command.status,
      },
      true,
    );

    await this.plantWriteRepository.save(existingPlant);

    await this.eventBus.publishAll(existingPlant.getUncommittedEvents());
  }
}
