import { ContainerViewModelFactory } from '@/core/plant-context/containers/domain/factories/container-view-model/container-view-model.factory';
import { ContainerPlantViewModel } from '@/core/plant-context/containers/domain/view-models/container-plant/container-plant.view-model';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { ContainerMongoDbDto } from '@/core/plant-context/containers/infrastructure/database/mongodb/dtos/container-mongodb.dto';
import { ContainerPlantMongoDbDto } from '@/core/plant-context/containers/infrastructure/database/mongodb/dtos/container-plant-mongodb.dto';
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

    // 01: Convert plants from MongoDB DTO to ContainerPlantViewModel
    const plants: ContainerPlantViewModel[] = doc.plants.map((plantDoc) =>
      this.toPlantViewModel(plantDoc),
    );

    return this.containerViewModelFactory.create({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      plants,
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

    // 01: Convert plants from ContainerPlantViewModel to MongoDB DTO
    const plants: ContainerPlantMongoDbDto[] = containerViewModel.plants.map(
      (plant) => this.toPlantMongoData(plant),
    );

    return {
      id: containerViewModel.id,
      name: containerViewModel.name,
      type: containerViewModel.type,
      plants,
      numberOfPlants: containerViewModel.numberOfPlants,
      createdAt: containerViewModel.createdAt,
      updatedAt: containerViewModel.updatedAt,
    };
  }

  /**
   * Converts a MongoDB plant document to a container plant view model.
   *
   * @param plantDoc - The MongoDB plant document to convert
   * @returns The container plant view model
   */
  private toPlantViewModel(
    plantDoc: ContainerPlantMongoDbDto,
  ): ContainerPlantViewModel {
    return new ContainerPlantViewModel({
      id: plantDoc.id,
      name: plantDoc.name,
      species: plantDoc.species,
      plantedDate: plantDoc.plantedDate
        ? plantDoc.plantedDate instanceof Date
          ? plantDoc.plantedDate
          : new Date(plantDoc.plantedDate)
        : null,
      notes: plantDoc.notes,
      status: plantDoc.status,
      createdAt:
        plantDoc.createdAt instanceof Date
          ? plantDoc.createdAt
          : new Date(plantDoc.createdAt),
      updatedAt:
        plantDoc.updatedAt instanceof Date
          ? plantDoc.updatedAt
          : new Date(plantDoc.updatedAt),
    });
  }

  /**
   * Converts a container plant view model to a MongoDB plant document.
   *
   * @param plant - The container plant view model to convert
   * @returns The MongoDB plant document
   */
  private toPlantMongoData(
    plant: ContainerPlantViewModel,
  ): ContainerPlantMongoDbDto {
    return {
      id: plant.id,
      name: plant.name,
      species: plant.species,
      plantedDate: plant.plantedDate,
      notes: plant.notes,
      status: plant.status,
      createdAt: plant.createdAt,
      updatedAt: plant.updatedAt,
    };
  }
}
