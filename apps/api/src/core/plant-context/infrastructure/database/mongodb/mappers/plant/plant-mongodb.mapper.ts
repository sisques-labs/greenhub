import { PlantViewModelFactory } from '@/core/plant-context/domain/factories/view-models/plant-view-model/plant-view-model.factory';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { PlantMongoDbDto } from '@/core/plant-context/infrastructure/database/mongodb/dtos/plant/plant-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Mapper for converting between PlantViewModel domain entities and MongoDB documents.
 *
 * @remarks
 * This mapper handles the transformation between the domain layer (PlantViewModel) and the
 * MongoDB documents, ensuring proper conversion of dates and nullable fields.
 */
@Injectable()
export class PlantMongoDBMapper {
  private readonly logger = new Logger(PlantMongoDBMapper.name);

  constructor(private readonly plantViewModelFactory: PlantViewModelFactory) {}

  /**
   * Converts a MongoDB document to a plant view model.
   *
   * @param doc - The MongoDB document to convert
   * @returns The plant view model
   */
  public toViewModel(doc: PlantMongoDbDto): PlantViewModel {
    this.logger.log(
      `Converting MongoDB document to plant view model with id ${doc.id}`,
    );

    return this.plantViewModelFactory.create({
      id: doc.id,
      growingUnitId: doc.growingUnitId,
      name: doc.name,
      species: doc.species,
      plantedDate: doc.plantedDate ? new Date(doc.plantedDate) : null,
      notes: doc.notes,
      status: doc.status,
      createdAt:
        doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
      updatedAt:
        doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt),
    });
  }

  /**
   * Converts a plant view model to a MongoDB document.
   *
   * @param plantViewModel - The plant view model to convert
   * @returns The MongoDB document
   */
  public toMongoData(plantViewModel: PlantViewModel): PlantMongoDbDto {
    this.logger.log(
      `Converting plant view model with id ${plantViewModel.id} to MongoDB document`,
    );

    return {
      id: plantViewModel.id,
      growingUnitId: plantViewModel.growingUnitId,
      name: plantViewModel.name,
      species: plantViewModel.species,
      plantedDate: plantViewModel.plantedDate,
      notes: plantViewModel.notes,
      status: plantViewModel.status,
      createdAt: plantViewModel.createdAt,
      updatedAt: plantViewModel.updatedAt,
    };
  }
}
