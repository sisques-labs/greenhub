import { Logger, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { LocationFindByCriteriaQuery } from '@/core/location-context/application/queries/location/location-find-by-criteria/location-find-by-criteria.query';
import { LocationViewModelFindByIdQuery } from '@/core/location-context/application/queries/location/location-view-model-find-by-id/location-view-model-find-by-id.query';
import { LocationFindByCriteriaRequestDto } from '@/core/location-context/transport/graphql/dtos/requests/location/location-find-by-criteria.request.dto';
import { LocationFindByIdRequestDto } from '@/core/location-context/transport/graphql/dtos/requests/location/location-find-by-id.request.dto';
import {
	LocationResponseDto,
	PaginatedLocationResultDto,
} from '@/core/location-context/transport/graphql/dtos/responses/location/location.response.dto';
import { LocationGraphQLMapper } from '@/core/location-context/transport/graphql/mappers/location/location.mapper';
import { JwtAuthGuard } from '@/generic/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/generic/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/generic/auth/infrastructure/guards/roles/roles.guard';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { Criteria } from '@/shared/domain/entities/criteria';

/**
 * GraphQL resolver for location queries.
 *
 * @remarks
 * Handles all read operations for locations. Requires authentication and appropriate roles.
 */
@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.USER)
export class LocationQueriesResolver {
	private readonly logger = new Logger(LocationQueriesResolver.name);

	constructor(
		private readonly queryBus: QueryBus,
		private readonly locationGraphQLMapper: LocationGraphQLMapper,
	) {}

	/**
	 * Finds locations that satisfy specified criteria such as filtering, sorting, and pagination.
	 *
	 * @param input - Optional input parameters containing filters, sorts, and pagination settings
	 * @returns A promise resolving to paginated results of locations matching the provided criteria
	 */
	@Query(() => PaginatedLocationResultDto)
	async locationsFindByCriteria(
		@Args('input', { nullable: true })
		input?: LocationFindByCriteriaRequestDto,
	): Promise<PaginatedLocationResultDto> {
		this.logger.log(
			`Finding locations by criteria: ${JSON.stringify(input)}`,
		);

		// 01: Convert DTO to domain Criteria
		const criteria = new Criteria(
			input?.filters,
			input?.sorts,
			input?.pagination,
		);

		// 02: Execute query
		const result = await this.queryBus.execute(
			new LocationFindByCriteriaQuery(criteria),
		);

		// 03: Convert to response DTO
		return this.locationGraphQLMapper.toPaginatedResponseDto(result);
	}

	/**
	 * Finds a location by its unique identifier.
	 *
	 * @param input - Input containing the location ID
	 * @returns A promise resolving to the location if found, null otherwise
	 */
	@Query(() => LocationResponseDto, { nullable: true })
	async locationFindById(
		@Args('input') input: LocationFindByIdRequestDto,
	): Promise<LocationResponseDto | null> {
		this.logger.log(`Finding location by id: ${input.id}`);

		// 01: Execute query
		const result = await this.queryBus.execute(
			new LocationViewModelFindByIdQuery({ id: input.id }),
		);

		// 02: Convert to response DTO
		return result ? this.locationGraphQLMapper.toResponseDto(result) : null;
	}
}

