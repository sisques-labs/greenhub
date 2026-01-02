import { FindPlantsByCriteriaQuery } from '@/core/plant-context/application/queries/plant/find-plants-by-criteria/find-plants-by-criteria.query';
import { PlantFindByIdQuery } from '@/core/plant-context/application/queries/plant/plant-find-by-id/plant-find-by-id.query';
import { PlantFindByCriteriaRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/plant/plant-find-by-criteria.request.dto';
import { PlantFindByIdRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/plant/plant-find-by-id.request.dto';
import {
	PaginatedPlantResultDto,
	PlantResponseDto,
} from '@/core/plant-context/transport/graphql/dtos/responses/plant/plant.response.dto';
import { PlantGraphQLMapper } from '@/core/plant-context/transport/graphql/mappers/plant/plant.mapper';
import { JwtAuthGuard } from '@/generic/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/generic/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/generic/auth/infrastructure/guards/roles/roles.guard';
import { Criteria } from '@/shared/domain/entities/criteria';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { Logger, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

/**
 * GraphQL resolver for plant queries.
 *
 * @remarks
 * Handles all read operations for plants. Requires authentication and appropriate roles.
 */
@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.USER)
export class PlantQueriesResolver {
	private readonly logger = new Logger(PlantQueriesResolver.name);

	constructor(
		private readonly queryBus: QueryBus,
		private readonly plantGraphQLMapper: PlantGraphQLMapper,
	) {}

	/**
	 * Finds plants that satisfy specified criteria such as filtering, sorting, and pagination.
	 *
	 * @param input - Optional input parameters containing filters, sorts, and pagination settings
	 * @returns A promise resolving to paginated results of plants matching the provided criteria
	 */
	@Query(() => PaginatedPlantResultDto)
	async plantsFindByCriteria(
		@Args('input', { nullable: true })
		input?: PlantFindByCriteriaRequestDto,
	): Promise<PaginatedPlantResultDto> {
		this.logger.log(`Finding plants by criteria: ${JSON.stringify(input)}`);

		// 01: Convert DTO to domain Criteria
		const criteria = new Criteria(
			input?.filters,
			input?.sorts,
			input?.pagination,
		);

		// 02: Execute query
		const result = await this.queryBus.execute(
			new FindPlantsByCriteriaQuery(criteria),
		);

		// 03: Convert to response DTO
		return this.plantGraphQLMapper.toPaginatedResponseDto(result);
	}

	/**
	 * Finds a plant by its unique identifier.
	 *
	 * @param input - Input containing the plant ID
	 * @returns A promise resolving to the plant if found, null otherwise
	 */
	@Query(() => PlantResponseDto, { nullable: true })
	async plantFindById(
		@Args('input') input: PlantFindByIdRequestDto,
	): Promise<PlantResponseDto | null> {
		this.logger.log(`Finding plant by id: ${input.id}`);

		// 01: Execute query
		const result = await this.queryBus.execute(
			new PlantFindByIdQuery({ id: input.id }),
		);

		// 02: Convert to response DTO
		return result
			? this.plantGraphQLMapper.toResponseDtoFromEntity(result)
			: null;
	}
}
