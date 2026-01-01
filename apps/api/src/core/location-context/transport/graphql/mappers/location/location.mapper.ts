import { Injectable, Logger } from '@nestjs/common';

import { LocationViewModel } from '@/core/location-context/domain/view-models/location/location.view-model';
import {
	LocationResponseDto,
	PaginatedLocationResultDto,
} from '@/core/location-context/transport/graphql/dtos/responses/location/location.response.dto';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

/**
 * Mapper for converting between LocationViewModel domain entities and GraphQL DTOs.
 *
 * @remarks
 * This mapper handles the transformation between the domain layer (LocationViewModel) and the
 * GraphQL transport layer (LocationResponseDto), ensuring proper conversion of dates and nullable fields.
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
	toResponseDto(location: LocationViewModel): LocationResponseDto {
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

	/**
	 * Converts a paginated result to a paginated response DTO.
	 *
	 * @param paginatedResult - The paginated result to convert
	 * @returns The paginated response DTO
	 */
	toPaginatedResponseDto(
		paginatedResult: PaginatedResult<LocationViewModel>,
	): PaginatedLocationResultDto {
		this.logger.log(
			`Mapping paginated location result to response dto: ${JSON.stringify(paginatedResult)}`,
		);

		return {
			items: paginatedResult.items.map((location) =>
				this.toResponseDto(location),
			),
			total: paginatedResult.total,
			page: paginatedResult.page,
			perPage: paginatedResult.perPage,
			totalPages: paginatedResult.totalPages,
		};
	}
}

