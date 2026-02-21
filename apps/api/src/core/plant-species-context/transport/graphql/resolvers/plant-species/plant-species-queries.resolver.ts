import { Logger, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { PlantSpeciesFindByCriteriaQuery } from '@/core/plant-species-context/application/queries/plant-species/plant-species-find-by-criteria/plant-species-find-by-criteria.query';
import { PlantSpeciesFindByIdQuery } from '@/core/plant-species-context/application/queries/plant-species/plant-species-find-by-id/plant-species-find-by-id.query';
import { PlantSpeciesFindByCategoryRequestDto } from '@/core/plant-species-context/transport/graphql/dtos/requests/plant-species/plant-species-find-by-category.request.dto';
import { PlantSpeciesFindByCriteriaRequestDto } from '@/core/plant-species-context/transport/graphql/dtos/requests/plant-species/plant-species-find-by-criteria.request.dto';
import { PlantSpeciesFindByDifficultyRequestDto } from '@/core/plant-species-context/transport/graphql/dtos/requests/plant-species/plant-species-find-by-difficulty.request.dto';
import { PlantSpeciesFindByIdRequestDto } from '@/core/plant-species-context/transport/graphql/dtos/requests/plant-species/plant-species-find-by-id.request.dto';
import { PlantSpeciesSearchRequestDto } from '@/core/plant-species-context/transport/graphql/dtos/requests/plant-species/plant-species-search.request.dto';
import {
	PaginatedPlantSpeciesResultDto,
	PlantSpeciesResponseDto,
} from '@/core/plant-species-context/transport/graphql/dtos/responses/plant-species/plant-species.response.dto';
import { PlantSpeciesGraphQLMapper } from '@/core/plant-species-context/transport/graphql/mappers/plant-species/plant-species.mapper';
import { JwtAuthGuard } from '@/generic/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/generic/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/generic/auth/infrastructure/guards/roles/roles.guard';
import { Criteria } from '@/shared/domain/entities/criteria';
import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';

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
	 * Finds all plant species.
	 *
	 * @returns A promise resolving to an array of all plant species
	 */
	@Query(() => [PlantSpeciesResponseDto])
	async plantSpeciesFindAll(): Promise<PlantSpeciesResponseDto[]> {
		this.logger.log('Finding all plant species');

		// 01: Create empty criteria
		const criteria = new Criteria([], [], { page: 1, perPage: 1000 });

		// 02: Execute query
		const result = await this.queryBus.execute(
			new PlantSpeciesFindByCriteriaQuery(criteria),
		);

		// 03: Convert to response DTOs
		return result.items.map((item) =>
			this.plantSpeciesGraphQLMapper.toResponseDto(item),
		);
	}

	/**
	 * Finds plant species by category.
	 *
	 * @param input - Input containing the category to filter by
	 * @returns A promise resolving to an array of plant species in the given category
	 */
	@Query(() => [PlantSpeciesResponseDto])
	async plantSpeciesFindByCategory(
		@Args('input') input: PlantSpeciesFindByCategoryRequestDto,
	): Promise<PlantSpeciesResponseDto[]> {
		this.logger.log(
			`Finding plant species by category: ${JSON.stringify(input)}`,
		);

		// 01: Create criteria with category filter
		const criteria = new Criteria(
			[{ field: 'category', operator: FilterOperator.EQUALS, value: input.category }],
			[],
			{ page: 1, perPage: 1000 },
		);

		// 02: Execute query
		const result = await this.queryBus.execute(
			new PlantSpeciesFindByCriteriaQuery(criteria),
		);

		// 03: Convert to response DTOs
		return result.items.map((item) =>
			this.plantSpeciesGraphQLMapper.toResponseDto(item),
		);
	}

	/**
	 * Finds plant species by difficulty level.
	 *
	 * @param input - Input containing the difficulty level to filter by
	 * @returns A promise resolving to an array of plant species at the given difficulty
	 */
	@Query(() => [PlantSpeciesResponseDto])
	async plantSpeciesFindByDifficulty(
		@Args('input') input: PlantSpeciesFindByDifficultyRequestDto,
	): Promise<PlantSpeciesResponseDto[]> {
		this.logger.log(
			`Finding plant species by difficulty: ${JSON.stringify(input)}`,
		);

		// 01: Create criteria with difficulty filter
		const criteria = new Criteria(
			[{ field: 'difficulty', operator: FilterOperator.EQUALS, value: input.difficulty }],
			[],
			{ page: 1, perPage: 1000 },
		);

		// 02: Execute query
		const result = await this.queryBus.execute(
			new PlantSpeciesFindByCriteriaQuery(criteria),
		);

		// 03: Convert to response DTOs
		return result.items.map((item) =>
			this.plantSpeciesGraphQLMapper.toResponseDto(item),
		);
	}

	/**
	 * Searches plant species by name.
	 *
	 * @param input - Input containing the search query
	 * @returns A promise resolving to an array of plant species matching the search query
	 */
	@Query(() => [PlantSpeciesResponseDto])
	async plantSpeciesSearch(
		@Args('input') input: PlantSpeciesSearchRequestDto,
	): Promise<PlantSpeciesResponseDto[]> {
		this.logger.log(
			`Searching plant species with query: ${JSON.stringify(input)}`,
		);

		// 01: Create criteria with common name filter
		const criteria = new Criteria(
			[{ field: 'commonName', operator: FilterOperator.LIKE, value: input.query }],
			[],
			{ page: 1, perPage: 1000 },
		);

		// 02: Execute query
		const result = await this.queryBus.execute(
			new PlantSpeciesFindByCriteriaQuery(criteria),
		);

		// 03: Convert to response DTOs
		return result.items.map((item) =>
			this.plantSpeciesGraphQLMapper.toResponseDto(item),
		);
	}

	/**
	 * Finds all verified plant species.
	 *
	 * @returns A promise resolving to an array of verified plant species
	 */
	@Query(() => [PlantSpeciesResponseDto])
	async plantSpeciesFindVerified(): Promise<PlantSpeciesResponseDto[]> {
		this.logger.log('Finding verified plant species');

		// 01: Create criteria with isVerified filter
		const criteria = new Criteria(
			[{ field: 'isVerified', operator: FilterOperator.EQUALS, value: 'true' }],
			[],
			{ page: 1, perPage: 1000 },
		);

		// 02: Execute query
		const result = await this.queryBus.execute(
			new PlantSpeciesFindByCriteriaQuery(criteria),
		);

		// 03: Convert to response DTOs
		return result.items.map((item) =>
			this.plantSpeciesGraphQLMapper.toResponseDto(item),
		);
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
