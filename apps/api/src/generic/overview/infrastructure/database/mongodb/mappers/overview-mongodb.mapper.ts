import { Injectable, Logger } from '@nestjs/common';
import { OverviewViewModelFactory } from '@/generic/overview/domain/factories/view-models/plant-view-model/overview-view-model.factory';
import { OverviewViewModel } from '@/generic/overview/domain/view-models/plant/overview.view-model';
import { OverviewMongoDbDto } from '@/generic/overview/infrastructure/database/mongodb/dtos/overview-mongodb.dto';

/**
 * Mapper for converting between OverviewViewModel domain entities and MongoDB documents.
 *
 * @remarks
 * This mapper handles the transformation between the domain layer (OverviewViewModel) and the
 * MongoDB documents, ensuring proper conversion of dates and nullable fields.
 */
@Injectable()
export class OverviewMongoDBMapper {
  private readonly logger = new Logger(OverviewMongoDBMapper.name);

  constructor(
    private readonly overviewViewModelFactory: OverviewViewModelFactory,
  ) {}

  /**
   * Converts a MongoDB document to an overview view model.
   *
   * @param doc - The MongoDB document to convert
   * @returns The overview view model
   */
  public toViewModel(doc: OverviewMongoDbDto): OverviewViewModel {
    this.logger.log(
      `Converting MongoDB document to overview view model with id ${doc.id}`,
    );

    return this.overviewViewModelFactory.create({
      id: doc.id,
      totalPlants: doc.totalPlants,
      totalActivePlants: doc.totalActivePlants,
      averagePlantsPerGrowingUnit: doc.averagePlantsPerGrowingUnit,
      plantsPlanted: doc.plantsPlanted,
      plantsGrowing: doc.plantsGrowing,
      plantsHarvested: doc.plantsHarvested,
      plantsDead: doc.plantsDead,
      plantsArchived: doc.plantsArchived,
      plantsWithoutPlantedDate: doc.plantsWithoutPlantedDate,
      plantsWithNotes: doc.plantsWithNotes,
      recentPlants: doc.recentPlants,
      totalGrowingUnits: doc.totalGrowingUnits,
      activeGrowingUnits: doc.activeGrowingUnits,
      emptyGrowingUnits: doc.emptyGrowingUnits,
      growingUnitsPot: doc.growingUnitsPot,
      growingUnitsGardenBed: doc.growingUnitsGardenBed,
      growingUnitsHangingBasket: doc.growingUnitsHangingBasket,
      growingUnitsWindowBox: doc.growingUnitsWindowBox,
      totalCapacity: doc.totalCapacity,
      totalCapacityUsed: doc.totalCapacityUsed,
      averageOccupancy: doc.averageOccupancy,
      growingUnitsAtLimit: doc.growingUnitsAtLimit,
      growingUnitsFull: doc.growingUnitsFull,
      totalRemainingCapacity: doc.totalRemainingCapacity,
      growingUnitsWithDimensions: doc.growingUnitsWithDimensions,
      totalVolume: doc.totalVolume,
      averageVolume: doc.averageVolume,
      minPlantsPerGrowingUnit: doc.minPlantsPerGrowingUnit,
      maxPlantsPerGrowingUnit: doc.maxPlantsPerGrowingUnit,
      medianPlantsPerGrowingUnit: doc.medianPlantsPerGrowingUnit,
      createdAt:
        doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
      updatedAt:
        doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt),
    });
  }

  /**
   * Converts an overview view model to a MongoDB document.
   *
   * @param overviewViewModel - The overview view model to convert
   * @returns The MongoDB document
   */
  public toMongoData(overviewViewModel: OverviewViewModel): OverviewMongoDbDto {
    this.logger.log(
      `Converting overview view model with id ${overviewViewModel.id} to MongoDB document`,
    );

    return {
      id: overviewViewModel.id,
      totalPlants: overviewViewModel.totalPlants,
      totalActivePlants: overviewViewModel.totalActivePlants,
      averagePlantsPerGrowingUnit:
        overviewViewModel.averagePlantsPerGrowingUnit,
      plantsPlanted: overviewViewModel.plantsPlanted,
      plantsGrowing: overviewViewModel.plantsGrowing,
      plantsHarvested: overviewViewModel.plantsHarvested,
      plantsDead: overviewViewModel.plantsDead,
      plantsArchived: overviewViewModel.plantsArchived,
      plantsWithoutPlantedDate: overviewViewModel.plantsWithoutPlantedDate,
      plantsWithNotes: overviewViewModel.plantsWithNotes,
      recentPlants: overviewViewModel.recentPlants,
      totalGrowingUnits: overviewViewModel.totalGrowingUnits,
      activeGrowingUnits: overviewViewModel.activeGrowingUnits,
      emptyGrowingUnits: overviewViewModel.emptyGrowingUnits,
      growingUnitsPot: overviewViewModel.growingUnitsPot,
      growingUnitsGardenBed: overviewViewModel.growingUnitsGardenBed,
      growingUnitsHangingBasket: overviewViewModel.growingUnitsHangingBasket,
      growingUnitsWindowBox: overviewViewModel.growingUnitsWindowBox,
      totalCapacity: overviewViewModel.totalCapacity,
      totalCapacityUsed: overviewViewModel.totalCapacityUsed,
      averageOccupancy: overviewViewModel.averageOccupancy,
      growingUnitsAtLimit: overviewViewModel.growingUnitsAtLimit,
      growingUnitsFull: overviewViewModel.growingUnitsFull,
      totalRemainingCapacity: overviewViewModel.totalRemainingCapacity,
      growingUnitsWithDimensions: overviewViewModel.growingUnitsWithDimensions,
      totalVolume: overviewViewModel.totalVolume,
      averageVolume: overviewViewModel.averageVolume,
      minPlantsPerGrowingUnit: overviewViewModel.minPlantsPerGrowingUnit,
      maxPlantsPerGrowingUnit: overviewViewModel.maxPlantsPerGrowingUnit,
      medianPlantsPerGrowingUnit: overviewViewModel.medianPlantsPerGrowingUnit,
      createdAt: overviewViewModel.createdAt,
      updatedAt: overviewViewModel.updatedAt,
    };
  }
}
