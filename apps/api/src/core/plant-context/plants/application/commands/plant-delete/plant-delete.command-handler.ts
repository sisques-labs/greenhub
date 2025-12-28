import { AssertPlantExistsService } from '@/core/plant-context/plants/application/services/assert-plant-exists/assert-plant-exists.service';
import {
  PLANT_WRITE_REPOSITORY_TOKEN,
  PlantWriteRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-write/plant-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PlantDeleteCommand } from './plant-delete.command';

/**
 * Command handler for deleting a plant.
 *
 * @remarks
 * This handler orchestrates the deletion of a plant aggregate, removes it from the write repository,
 * and publishes domain events.
 */
@CommandHandler(PlantDeleteCommand)
export class PlantDeleteCommandHandler
  implements ICommandHandler<PlantDeleteCommand>
{
  private readonly logger = new Logger(PlantDeleteCommandHandler.name);

  constructor(
    @Inject(PLANT_WRITE_REPOSITORY_TOKEN)
    private readonly plantWriteRepository: PlantWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertPlantExistsService: AssertPlantExistsService,
  ) {}

  /**
   * Executes the plant delete command.
   *
   * @param command - The command to execute
   * @returns void
   */
  async execute(command: PlantDeleteCommand): Promise<void> {
    this.logger.log(
      `Executing delete plant command by id: ${command.id.value}`,
    );

    const existingPlant = await this.assertPlantExistsService.execute(
      command.id.value,
    );

    existingPlant.delete();

    await this.plantWriteRepository.delete(existingPlant.id.value);

    await this.eventBus.publishAll(existingPlant.getUncommittedEvents());
  }
}
