import { ContainerAggregate } from '@/core/plant-context/containers/domain/aggregates/container.aggregate';
import { IContainerCreateViewModelDto } from '@/core/plant-context/containers/domain/dtos/view-models/container-create/container-create-view-model.dto';
import { ContainerPrimitives } from '@/core/plant-context/containers/domain/primitives/container.primitives';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Factory class responsible for creating {@link ContainerViewModel} instances from different sources
 * such as DTOs, primitives, and aggregates. This promotes a consistent approach for transforming
 * domain or persistence layer data into a view model suitable for presentation or API response.
 *
 * @remarks
 * Implements {@link IReadFactory} to standardize transformation methods for the container context.
 *
 * @example
 * const factory = new ContainerViewModelFactory();
 * const viewModel = factory.fromAggregate(containerAggregate);
 */
@Injectable()
export class ContainerViewModelFactory
  implements
    IReadFactory<
      ContainerViewModel,
      IContainerCreateViewModelDto,
      ContainerAggregate,
      ContainerPrimitives
    >
{
  private readonly logger = new Logger(ContainerViewModelFactory.name);

  /**
   * Creates a new {@link ContainerViewModel} instance from an {@link IContainerCreateViewModelDto}.
   *
   * @param data - The DTO containing container creation data.
   * @returns The corresponding {@link ContainerViewModel} instance.
   *
   * @example
   * const dto: IContainerCreateViewModelDto = {...};
   * const viewModel = factory.create(dto);
   */
  public create(data: IContainerCreateViewModelDto): ContainerViewModel {
    this.logger.log(
      `Creating container view model from DTO: ${JSON.stringify(data)}`,
    );
    return new ContainerViewModel(data);
  }

  /**
   * Creates a {@link ContainerViewModel} instance from a set of container primitives.
   *
   * @param containerPrimitives - The primitives object representing low-level container data.
   * @returns The constructed {@link ContainerViewModel}.
   *
   * @example
   * const primitives: ContainerPrimitives = {...};
   * const viewModel = factory.fromPrimitives(primitives);
   */
  public fromPrimitives(
    containerPrimitives: ContainerPrimitives,
  ): ContainerViewModel {
    this.logger.log(
      `Creating container view model from primitives: ${containerPrimitives}`,
    );

    return new ContainerViewModel({
      id: containerPrimitives.id,
      name: containerPrimitives.name,
      type: containerPrimitives.type,
      plants: [],
      numberOfPlants: 0,
      createdAt: containerPrimitives.createdAt,
      updatedAt: containerPrimitives.updatedAt,
    });
  }

  /**
   * Creates a {@link ContainerViewModel} instance from a {@link ContainerAggregate}.
   *
   * @param containerAggregate - The aggregate root containing the container domain entity.
   * @returns A {@link ContainerViewModel} populated from the aggregate.
   *
   * @example
   * const viewModel = factory.fromAggregate(containerAggregate);
   */
  public fromAggregate(
    containerAggregate: ContainerAggregate,
  ): ContainerViewModel {
    this.logger.log(
      `Creating container view model from aggregate: ${containerAggregate}`,
    );

    return new ContainerViewModel({
      id: containerAggregate.id.value,
      name: containerAggregate.name.value,
      type: containerAggregate.type.value,
      plants: [],
      numberOfPlants: 0, // Default value, will be updated by event handlers
      createdAt: containerAggregate.createdAt.value,
      updatedAt: containerAggregate.updatedAt.value,
    });
  }
}
