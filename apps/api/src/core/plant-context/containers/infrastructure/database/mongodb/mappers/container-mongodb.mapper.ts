import { ContainerViewModelFactory } from '@/core/plant-context/containers/domain/factories/container-view-model/container-view-model.factory';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { ContainerMongoDbDto } from '@/core/plant-context/containers/infrastructure/database/mongodb/dtos/container-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Mapper for converting between ContainerViewModel domain entities and MongoDB documents.
 *
 * @remarks
 * This mapper handles the transformation between the domain layer (ContainerViewModel) and the
 * MongoDB documents, ensuring proper conversion of dates and nullable fields.
 */
@Injectable()
export class ContainerMongoDBMapper {
  private readonly logger = new Logger(ContainerMongoDBMapper.name);

  constructor(
    private readonly containerViewModelFactory: ContainerViewModelFactory,
  ) {}

  /**
   * Converts a MongoDB document to a container view model.
   *
   * @param doc - The MongoDB document to convert
   * @returns The container view model
   */
  public toViewModel(doc: ContainerMongoDbDto): ContainerViewModel {
    this.logger.log(
      `Converting MongoDB document to container view model with id ${doc.id}`,
    );

    return this.containerViewModelFactory.create({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      plants: [], // Plants are loaded separately via ContainerObtainPlantsService
      numberOfPlants: doc.numberOfPlants,
      createdAt:
        doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
      updatedAt:
        doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt),
    });
  }

  /**
   * Converts a container view model to a MongoDB document.
   *
   * @param containerViewModel - The container view model to convert
   * @returns The MongoDB document
   */
  public toMongoData(
    containerViewModel: ContainerViewModel,
  ): ContainerMongoDbDto {
    this.logger.log(
      `Converting container view model with id ${containerViewModel.id} to MongoDB document`,
    );

    return {
      id: containerViewModel.id,
      name: containerViewModel.name,
      type: containerViewModel.type,
      numberOfPlants: containerViewModel.numberOfPlants,
      createdAt: containerViewModel.createdAt,
      updatedAt: containerViewModel.updatedAt,
    };
  }
}
