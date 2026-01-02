import { LocationViewModel } from '@/core/plant-context/domain/view-models/location/location.view-model';
import { GrowingUnitLocationResponseDto } from '@/core/plant-context/transport/graphql/dtos/responses/location/location.response.dto';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Mapper for converting between Plant domain entities and GraphQL DTOs.
 *
 * @remarks
 * This mapper handles the transformation between the domain layer (PlantEntity, PlantViewModel) and the
 * GraphQL transport layer (PlantResponseDto), ensuring proper conversion of dates and nullable fields.
 */
@Injectable()
export class LocationGraphQLMapper {
	private readonly logger = new Logger(LocationGraphQLMapper.name);

	/**
	 * Converts a location view model to a GraphQL response DTO.
	 *
	 * @param location - The location view model to convert
	 * @returns The GraphQL response DTO
	 */
	toResponseDtoFromViewModel(
		location: LocationViewModel,
	): GrowingUnitLocationResponseDto {
		this.logger.log(
			`Mapping location view model to response dto: ${location.id}`,
		);

		return {
			id: location.id,
			name: location.name,
			type: location.type,
			description: location.description,
			createdAt: location.createdAt,
			updatedAt: location.updatedAt,
		};
	}
}
