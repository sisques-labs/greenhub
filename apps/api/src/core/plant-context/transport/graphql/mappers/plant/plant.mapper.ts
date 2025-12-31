import { Injectable, Logger } from '@nestjs/common';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { PlantResponseDto } from '@/core/plant-context/transport/graphql/dtos/responses/plant/plant.response.dto';

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

	/**
	 * Converts a plant entity to a GraphQL response DTO.
	 *
	 * @param plant - The plant entity to convert
	 * @returns The GraphQL response DTO
	 */
	toResponseDtoFromEntity(plant: PlantEntity): PlantResponseDto {
		this.logger.log(`Mapping plant entity to response dto: ${plant.id.value}`);

		const now = new Date();

		return {
			id: plant.id.value,
			growingUnitId: plant.growingUnitId.value,
			name: plant.name.value,
			species: plant.species.value,
			plantedDate: plant.plantedDate?.value ?? null,
			notes: plant.notes?.value ?? null,
			status: plant.status.value,
			createdAt: now,
			updatedAt: now,
		};
	}

	/**
	 * Converts a plant view model to a GraphQL response DTO.
	 *
	 * @param plant - The plant view model to convert
	 * @returns The GraphQL response DTO
	 */
	toResponseDtoFromViewModel(plant: PlantViewModel): PlantResponseDto {
		this.logger.log(`Mapping plant view model to response dto: ${plant.id}`);

		return {
			id: plant.id,
			growingUnitId: plant.growingUnitId,
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
