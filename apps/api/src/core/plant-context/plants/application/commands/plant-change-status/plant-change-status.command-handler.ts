import { AssertPlantExistsService } from '@/core/plant-context/plants/application/services/assert-plant-exists/assert-plant-exists.service';
import {
  PLANT_WRITE_REPOSITORY_TOKEN,
  PlantWriteRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-write/plant-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PlantChangeStatusCommand } from './plant-change-status.command';

/**
 * Command handler for changing a plant's status.
 *
 * @remarks
 * This handler orchestrates the status change of a plant aggregate, saves changes to the write repository,
 * and publishes domain events.
 */
@CommandHandler(PlantChangeStatusCommand)
export class PlantChangeStatusCommandHandler
  implements ICommandHandler<PlantChangeStatusCommand>
{
  private readonly logger = new Logger(PlantChangeStatusCommandHandler.name);

  constructor(
    @Inject(PLANT_WRITE_REPOSITORY_TOKEN)
    private readonly plantWriteRepository: PlantWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertPlantExistsService: AssertPlantExistsService,
  ) {}

  /**
   * Executes the plant change status command.
   *
   * @param command - The command to execute
   * @returns void
   */
  async execute(command: PlantChangeStatusCommand): Promise<void> {
    this.logger.log(
      `Executing change status plant command by id: ${command.id.value}`,
    );

    const existingPlant = await this.assertPlantExistsService.execute(
      command.id.value,
    );

    existingPlant.changeStatus(command.status, true);

    await this.plantWriteRepository.save(existingPlant);

    await this.eventBus.publishAll(existingPlant.getUncommittedEvents());
  }
}
