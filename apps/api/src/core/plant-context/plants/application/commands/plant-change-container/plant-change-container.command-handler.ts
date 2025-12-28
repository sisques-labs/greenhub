import { AssertPlantExistsService } from '@/core/plant-context/plants/application/services/assert-plant-exists/assert-plant-exists.service';
import {
  PLANT_WRITE_REPOSITORY_TOKEN,
  PlantWriteRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-write/plant-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PlantChangeContainerCommand } from './plant-change-container.command';

/**
 * Command handler for changing a plant's container.
 *
 * @remarks
 * This handler orchestrates the change of a plant's container, saves changes to the write repository,
 * and publishes domain events.
 */
@CommandHandler(PlantChangeContainerCommand)
export class PlantChangeContainerCommandHandler
  implements ICommandHandler<PlantChangeContainerCommand>
{
  private readonly logger = new Logger(PlantChangeContainerCommandHandler.name);

  constructor(
    @Inject(PLANT_WRITE_REPOSITORY_TOKEN)
    private readonly plantWriteRepository: PlantWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertPlantExistsService: AssertPlantExistsService,
  ) {}

  /**
   * Executes the plant change container command.
   *
   * @param command - The command to execute
   * @returns void
   */
  async execute(command: PlantChangeContainerCommand): Promise<void> {
    this.logger.log(
      `Executing change container command for plant: ${command.id.value}, new container: ${command.newContainerId.value}`,
    );

    // 01: Find the existing plant
    const existingPlant = await this.assertPlantExistsService.execute(
      command.id.value,
    );

    // 02: Change the container (this will generate PlantContainerChangedEvent)
    existingPlant.changeContainer(command.newContainerId, true);

    // 03: Save the plant
    await this.plantWriteRepository.save(existingPlant);

    // 04: Publish all events
    await this.eventBus.publishAll(existingPlant.getUncommittedEvents());
  }
}
