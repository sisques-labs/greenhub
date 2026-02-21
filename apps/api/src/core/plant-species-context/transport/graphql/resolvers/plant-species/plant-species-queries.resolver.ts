import { PlantSpeciesFindByCriteriaQuery } from '@/core/plant-species-context/application/queries/plant-species/plant-species-find-by-criteria/plant-species-find-by-criteria.query';
import { PlantSpeciesFindByIdQuery } from '@/core/plant-species-context/application/queries/plant-species/plant-species-find-by-id/plant-species-find-by-id.query';
import { PlantSpeciesFindByCriteriaRequestDto } from '@/core/plant-species-context/transport/graphql/dtos/requests/plant-species/plant-species-find-by-criteria.request.dto';
import { PlantSpeciesFindByIdRequestDto } from '@/core/plant-species-context/transport/graphql/dtos/requests/plant-species/plant-species-find-by-id.request.dto';
import {
	PaginatedPlantSpeciesResultDto,
	PlantSpeciesResponseDto,
} from '@/core/plant-species-context/transport/graphql/dtos/responses/plant-species/plant-species.response.dto';
import { PlantSpeciesGraphQLMapper } from '@/core/plant-species-context/transport/graphql/mappers/plant-species/plant-species.mapper';
import { JwtAuthGuard } from '@/generic/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/generic/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/generic/auth/infrastructure/guards/roles/roles.guard';
import { Criteria } from '@/shared/domain/entities/criteria';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { Logger, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

/**
 * GraphQL resolver for plant species queries.
 *
 * @remarks
 * Handles all read operations for plant species. Requires authentication and appropriate roles.
 */
@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.USER)
export class PlantSpeciesQueriesResolver {
	private readonly logger = new Logger(PlantSpeciesQueriesResolver.name);

	constructor(
		private readonly queryBus: QueryBus,
		private readonly plantSpeciesGraphQLMapper: PlantSpeciesGraphQLMapper,
	) {}

	/**
	 * Finds a plant species by its unique identifier.
	 *
	 * @param input - Input containing the plant species ID
	 * @returns A promise resolving to the plant species
	 */
	@Query(() => PlantSpeciesResponseDto)
	async plantSpeciesFindById(
		@Args('input') input: PlantSpeciesFindByIdRequestDto,
	): Promise<PlantSpeciesResponseDto> {
		this.logger.log(`Finding plant species by id: ${input.id}`);

		// 01: Execute query
		const result = await this.queryBus.execute(
			new PlantSpeciesFindByIdQuery({ id: input.id }),
		);

		// 02: Convert to response DTO
		return this.plantSpeciesGraphQLMapper.toResponseDto(result);
	}

	/**
	 * Finds plant species that satisfy specified criteria such as filtering, sorting, and pagination.
	 *
	 * @param input - Optional input parameters containing filters, sorts, and pagination settings
	 * @returns A promise resolving to paginated results of plant species matching the provided criteria
	 */
	@Query(() => PaginatedPlantSpeciesResultDto)
	async plantSpeciesFindByCriteria(
		@Args('input', { nullable: true })
		input?: PlantSpeciesFindByCriteriaRequestDto,
	): Promise<PaginatedPlantSpeciesResultDto> {
		this.logger.log(
			`Finding plant species by criteria: ${JSON.stringify(input)}`,
		);

		// 01: Convert DTO to domain Criteria
		const criteria = new Criteria(
			input?.filters,
			input?.sorts,
			input?.pagination,
		);

		// 02: Execute query
		const result = await this.queryBus.execute(
			new PlantSpeciesFindByCriteriaQuery(criteria),
		);

		// 03: Convert to response DTO
		return this.plantSpeciesGraphQLMapper.toPaginatedResponseDto(result);
	}
}
