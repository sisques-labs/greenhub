import { PlantAggregate } from '@/core/plant-context/plants/domain/aggregates/plant.aggregate';
import { IPlantCreateViewModelDto } from '@/core/plant-context/plants/domain/dtos/view-models/plant-create/plant-create-view-model.dto';
import { PlantPrimitives } from '@/core/plant-context/plants/domain/primitives/plant.primitives';
import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Factory class responsible for creating {@link PlantViewModel} instances from different sources
 * such as DTOs, primitives, and aggregates. This promotes a consistent approach for transforming
 * domain or persistence layer data into a view model suitable for presentation or API response.
 *
 * @remarks
 * Implements {@link IReadFactory} to standardize transformation methods for the plant context.
 *
 * @example
 * const factory = new PlantViewModelFactory();
 * const viewModel = factory.fromAggregate(plantAggregate);
 */
@Injectable()
export class PlantViewModelFactory
  implements
    IReadFactory<
      PlantViewModel,
      IPlantCreateViewModelDto,
      PlantAggregate,
      PlantPrimitives
    >
{
  private readonly logger = new Logger(PlantViewModelFactory.name);

  /**
   * Creates a new {@link PlantViewModel} instance from an {@link IPlantCreateViewModelDto}.
   *
   * @param data - The DTO containing plant creation data.
   * @returns The corresponding {@link PlantViewModel} instance.
   *
   * @example
   * const dto: IPlantCreateViewModelDto = {...};
   * const viewModel = factory.create(dto);
   */
  public create(data: IPlantCreateViewModelDto): PlantViewModel {
    this.logger.log(
      `Creating plant view model from DTO: ${JSON.stringify(data)}`,
    );
    return new PlantViewModel(data);
  }

  /**
   * Creates a {@link PlantViewModel} instance from a set of plant primitives.
   *
   * @param plantPrimitives - The primitives object representing low-level plant data.
   * @returns The constructed {@link PlantViewModel}.
   *
   * @example
   * const primitives: PlantPrimitives = {...};
   * const viewModel = factory.fromPrimitives(primitives);
   */
  public fromPrimitives(plantPrimitives: PlantPrimitives): PlantViewModel {
    this.logger.log(
      `Creating plant view model from primitives: ${plantPrimitives}`,
    );

    return new PlantViewModel({
      id: plantPrimitives.id,
      containerId: plantPrimitives.containerId,
      name: plantPrimitives.name,
      species: plantPrimitives.species,
      plantedDate: plantPrimitives.plantedDate,
      notes: plantPrimitives.notes,
      status: plantPrimitives.status,
      createdAt: plantPrimitives.createdAt,
      updatedAt: plantPrimitives.updatedAt,
    });
  }

  /**
   * Creates a {@link PlantViewModel} instance from a {@link PlantAggregate}.
   *
   * @param plantAggregate - The aggregate root containing the plant domain entity.
   * @returns A {@link PlantViewModel} populated from the aggregate.
   *
   * @example
   * const viewModel = factory.fromAggregate(plantAggregate);
   */
  public fromAggregate(plantAggregate: PlantAggregate): PlantViewModel {
    this.logger.log(
      `Creating plant view model from aggregate: ${plantAggregate}`,
    );

    return new PlantViewModel({
      id: plantAggregate.id.value,
      containerId: plantAggregate.containerId.value,
      name: plantAggregate.name.value,
      species: plantAggregate.species.value,
      plantedDate: plantAggregate.plantedDate?.value ?? null,
      notes: plantAggregate.notes?.value ?? null,
      status: plantAggregate.status.value,
      createdAt: plantAggregate.createdAt.value,
      updatedAt: plantAggregate.updatedAt.value,
    });
  }
}
