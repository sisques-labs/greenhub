import { PlantAggregateFactory } from '@/core/plant-context/plants/domain/factories/plant-aggregate/plant-aggregate.factory';
import {
  PLANT_WRITE_REPOSITORY_TOKEN,
  PlantWriteRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-write/plant-write.repository';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PlantCreateCommand } from './plant-create.command';

/**
 * Command handler for creating a new plant.
 *
 * @remarks
 * This handler orchestrates the creation of a plant aggregate, saves it to the write repository,
 * and publishes domain events.
 */
@CommandHandler(PlantCreateCommand)
export class PlantCreateCommandHandler
  implements ICommandHandler<PlantCreateCommand>
{
  private readonly logger = new Logger(PlantCreateCommandHandler.name);

  constructor(
    @Inject(PLANT_WRITE_REPOSITORY_TOKEN)
    private readonly plantWriteRepository: PlantWriteRepository,
    private readonly eventBus: EventBus,
    private readonly plantAggregateFactory: PlantAggregateFactory,
  ) {}

  /**
   * Executes the plant create command.
   *
   * @param command - The command to execute
   * @returns The created plant id
   */
  async execute(command: PlantCreateCommand): Promise<string> {
    this.logger.log(`Executing plant create command: ${command}`);

    const plant = this.plantAggregateFactory.create(
      {
        ...command,

        createdAt: new DateValueObject(new Date()),
        updatedAt: new DateValueObject(new Date()),
      },
      true,
    );

    await this.plantWriteRepository.save(plant);

    await this.eventBus.publishAll(plant.getUncommittedEvents());

    return plant.id.value;
  }
}
