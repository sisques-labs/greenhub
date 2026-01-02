import { Injectable, Logger } from '@nestjs/common';

import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { PlantGrowingUnitReferenceDto } from '@/core/plant-context/transport/graphql/dtos/responses/plant/plant-growing-unit-reference.response.dto';
import {
	PaginatedPlantResultDto,
	PlantResponseDto,
} from '@/core/plant-context/transport/graphql/dtos/responses/plant/plant.response.dto';
import { LocationGraphQLMapper } from '@/core/plant-context/transport/graphql/mappers/location/location.mapper';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

/**
 * Mapper for converting between Plant domain entities and GraphQL DTOs.
 *
 * @remarks
 * This mapper handles the transformation between the domain layer (PlantEntity, PlantViewModel) and the
 * GraphQL transport layer (PlantResponseDto), ensuring proper conversion of dates and nullable fields.
 */
@Injectable()
export class PlantGraphQLMapper {
	private readonly logger = new Logger(PlantGraphQLMapper.name);

	constructor(private readonly locationGraphQLMapper: LocationGraphQLMapper) {}

	/**
	 * Converts a plant view model to a GraphQL response DTO.
	 *
	 * @param plant - The plant view model to convert
	 * @returns The GraphQL response DTO
	 */
	toResponseDtoFromViewModel(plant: PlantViewModel): PlantResponseDto {
		this.logger.log(`Mapping plant view model to response dto: ${plant.id}`);

		// 01: Map location if present
		const location = plant.location
			? this.locationGraphQLMapper.toResponseDtoFromViewModel(plant.location)
			: undefined;

		// 02: Map growing unit reference if present
		const growingUnit: PlantGrowingUnitReferenceDto | undefined =
			plant.growingUnit
				? {
						id: plant.growingUnit.id,
						name: plant.growingUnit.name,
						type: plant.growingUnit.type,
						capacity: plant.growingUnit.capacity,
					}
				: undefined;

		return {
			id: plant.id,
			growingUnitId: plant.growingUnitId,
			name: plant.name,
			species: plant.species,
			plantedDate: plant.plantedDate,
			notes: plant.notes,
			status: plant.status,
			location,
			growingUnit,
			createdAt: plant.createdAt,
			updatedAt: plant.updatedAt,
		};
	}

	/**
	 * Converts a paginated result of plant view models to a paginated GraphQL response DTO.
	 *
	 * @param paginatedResult - The paginated result to convert
	 * @returns The paginated GraphQL response DTO
	 */
	toPaginatedResponseDto(
		paginatedResult: PaginatedResult<PlantViewModel>,
	): PaginatedPlantResultDto {
		return {
			items: paginatedResult.items.map((plant) =>
				this.toResponseDtoFromViewModel(plant),
			),
			total: paginatedResult.total,
			page: paginatedResult.page,
			perPage: paginatedResult.perPage,
			totalPages: paginatedResult.totalPages,
		};
	}
}
