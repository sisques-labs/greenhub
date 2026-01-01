import { Injectable, Logger } from '@nestjs/common';

import { OverviewViewModel } from '@/generic/overview/domain/view-models/plant/overview.view-model';
import { OverviewResponseDto } from '@/generic/overview/transport/graphql/dtos/responses/overview.response.dto';

/**
 * Mapper for converting between OverviewViewModel domain entities and GraphQL DTOs.
 *
 * @remarks
 * This mapper handles the transformation between the domain layer (OverviewViewModel) and the
 * GraphQL transport layer (OverviewResponseDto), ensuring proper conversion of dates and nullable fields.
 */
@Injectable()
export class OverviewGraphQLMapper {
	private readonly logger = new Logger(OverviewGraphQLMapper.name);

	/**
	 * Converts an overview view model to a GraphQL response DTO.
	 *
	 * @param overview - The overview view model to convert
	 * @returns The GraphQL response DTO
	 */
	toResponseDto(overview: OverviewViewModel): OverviewResponseDto {
		this.logger.log(
			`Mapping overview view model to response dto: ${overview.id}`,
		);

		return {
			id: overview.id,
			totalPlants: overview.totalPlants,
			totalActivePlants: overview.totalActivePlants,
			averagePlantsPerGrowingUnit: overview.averagePlantsPerGrowingUnit,
			plantsPlanted: overview.plantsPlanted,
			plantsGrowing: overview.plantsGrowing,
			plantsHarvested: overview.plantsHarvested,
			plantsDead: overview.plantsDead,
			plantsArchived: overview.plantsArchived,
			plantsWithoutPlantedDate: overview.plantsWithoutPlantedDate,
			plantsWithNotes: overview.plantsWithNotes,
			recentPlants: overview.recentPlants,
			totalGrowingUnits: overview.totalGrowingUnits,
			activeGrowingUnits: overview.activeGrowingUnits,
			emptyGrowingUnits: overview.emptyGrowingUnits,
			growingUnitsPot: overview.growingUnitsPot,
			growingUnitsGardenBed: overview.growingUnitsGardenBed,
			growingUnitsHangingBasket: overview.growingUnitsHangingBasket,
			growingUnitsWindowBox: overview.growingUnitsWindowBox,
			totalCapacity: overview.totalCapacity,
			totalCapacityUsed: overview.totalCapacityUsed,
			averageOccupancy: overview.averageOccupancy,
			growingUnitsAtLimit: overview.growingUnitsAtLimit,
			growingUnitsFull: overview.growingUnitsFull,
			totalRemainingCapacity: overview.totalRemainingCapacity,
			growingUnitsWithDimensions: overview.growingUnitsWithDimensions,
			totalVolume: overview.totalVolume,
			averageVolume: overview.averageVolume,
			minPlantsPerGrowingUnit: overview.minPlantsPerGrowingUnit,
			maxPlantsPerGrowingUnit: overview.maxPlantsPerGrowingUnit,
			medianPlantsPerGrowingUnit: overview.medianPlantsPerGrowingUnit,
			createdAt: overview.createdAt,
			updatedAt: overview.updatedAt,
		};
	}
}

