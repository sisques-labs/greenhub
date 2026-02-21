import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';
import {
	PaginatedPlantSpeciesResultDto,
	PlantSpeciesMatureSizeResponseDto,
	PlantSpeciesPhRangeResponseDto,
	PlantSpeciesResponseDto,
	PlantSpeciesTemperatureRangeResponseDto,
} from '@/core/plant-species-context/transport/graphql/dtos/responses/plant-species/plant-species.response.dto';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Mapper for converting between Plant Species domain view models and GraphQL DTOs.
 *
 * @remarks
 * This mapper handles the transformation between the domain layer (PlantSpeciesViewModel) and the
 * GraphQL transport layer (PlantSpeciesResponseDto), ensuring proper conversion of all fields
 * including nested objects and nullable fields.
 */
@Injectable()
export class PlantSpeciesGraphQLMapper {
	private readonly logger = new Logger(PlantSpeciesGraphQLMapper.name);

	/**
	 * Converts a plant species view model to a GraphQL response DTO.
	 *
	 * @param plantSpecies - The plant species view model to convert
	 * @returns The GraphQL response DTO
	 */
	toResponseDto(plantSpecies: PlantSpeciesViewModel): PlantSpeciesResponseDto {
		this.logger.log(
			`Mapping plant species view model to response dto: ${plantSpecies.id}`,
		);

		// 01: Map temperature range if present
		const temperatureRange: PlantSpeciesTemperatureRangeResponseDto | null =
			plantSpecies.temperatureRange
				? {
						min: plantSpecies.temperatureRange.min,
						max: plantSpecies.temperatureRange.max,
					}
				: null;

		// 02: Map pH range if present
		const phRange: PlantSpeciesPhRangeResponseDto | null = plantSpecies.phRange
			? {
					min: plantSpecies.phRange.min,
					max: plantSpecies.phRange.max,
				}
			: null;

		// 03: Map mature size if present
		const matureSize: PlantSpeciesMatureSizeResponseDto | null =
			plantSpecies.matureSize
				? {
						height: plantSpecies.matureSize.height,
						width: plantSpecies.matureSize.width,
					}
				: null;

		return {
			id: plantSpecies.id,
			commonName: plantSpecies.commonName,
			scientificName: plantSpecies.scientificName,
			family: plantSpecies.family,
			description: plantSpecies.description,
			category: plantSpecies.category,
			difficulty: plantSpecies.difficulty,
			growthRate: plantSpecies.growthRate,
			lightRequirements: plantSpecies.lightRequirements,
			waterRequirements: plantSpecies.waterRequirements,
			temperatureRange,
			humidityRequirements: plantSpecies.humidityRequirements,
			soilType: plantSpecies.soilType,
			phRange,
			matureSize,
			growthTime: plantSpecies.growthTime,
			tags: plantSpecies.tags,
			isVerified: plantSpecies.isVerified,
			contributorId: plantSpecies.contributorId,
			createdAt: plantSpecies.createdAt,
			updatedAt: plantSpecies.updatedAt,
		};
	}

	/**
	 * Converts a paginated result of plant species view models to a paginated GraphQL response DTO.
	 *
	 * @param paginatedResult - The paginated result to convert
	 * @returns The paginated GraphQL response DTO
	 */
	toPaginatedResponseDto(
		paginatedResult: PaginatedResult<PlantSpeciesViewModel>,
	): PaginatedPlantSpeciesResultDto {
		return {
			items: paginatedResult.items.map((plantSpecies) =>
				this.toResponseDto(plantSpecies),
			),
			total: paginatedResult.total,
			page: paginatedResult.page,
			perPage: paginatedResult.perPage,
			totalPages: paginatedResult.totalPages,
		};
	}
}
