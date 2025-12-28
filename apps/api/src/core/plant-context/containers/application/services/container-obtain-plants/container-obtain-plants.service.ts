import { ContainerPlantViewModel } from '@/core/plant-context/containers/domain/view-models/container-plant/container-plant.view-model';
import { FindPlantsViewModelByContainerIdQuery } from '@/core/plant-context/plants/application/queries/find-plants-view-model-by-container-id/find-plants-view-model-by-container-id.query';
import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Injectable, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

/**
 * Service responsible for obtaining plants within a specified container.
 *
 * @remarks
 * Uses the {@link QueryBus} to retrieve all plant view models associated
 * with a given container ID, then converts them to ContainerPlantViewModel.
 *
 * @implements {@link IBaseService} with `string` as input (containerId)
 * and `ContainerPlantViewModel[]` as output.
 */
@Injectable()
export class ContainerObtainPlantsService
  implements IBaseService<string, ContainerPlantViewModel[]>
{
  /**
   * Logger instance used for logging service operations.
   * @private
   */
  private readonly logger = new Logger(ContainerObtainPlantsService.name);

  /**
   * Initializes the service with access to the CQRS QueryBus.
   * @param queryBus - The QueryBus instance for querying plant data.
   */
  constructor(private readonly queryBus: QueryBus) {}

  /**
   * Obtains and returns all plants in a specified container.
   *
   * @param containerId - The unique identifier for the container.
   * @returns The plants found within the container as ContainerPlantViewModel instances.
   *
   * @throws May propagate errors from the query bus execution.
   */
  async execute(containerId: string): Promise<ContainerPlantViewModel[]> {
    this.logger.log(`Obtaining plants for container: ${containerId}`);

    // 01: Execute query to get plant view models
    const plantViewModels: PlantViewModel[] = await this.queryBus.execute(
      new FindPlantsViewModelByContainerIdQuery({ containerId }),
    );

    // 02: Convert PlantViewModel to ContainerPlantViewModel
    const containerPlants: ContainerPlantViewModel[] = plantViewModels.map(
      (plant) =>
        new ContainerPlantViewModel({
          id: plant.id,
          name: plant.name,
          species: plant.species,
          plantedDate: plant.plantedDate,
          notes: plant.notes,
          status: plant.status,
          createdAt: plant.createdAt,
          updatedAt: plant.updatedAt,
        }),
    );

    this.logger.debug(
      `Found ${containerPlants.length} plants for container: ${containerId}`,
    );

    return containerPlants;
  }
}
