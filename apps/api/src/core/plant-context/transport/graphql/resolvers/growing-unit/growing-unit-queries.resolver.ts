import { Logger, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { GrowingUnitFindByCriteriaQuery } from "@/core/plant-context/application/queries/growing-unit/growing-unit-find-by-criteria/growing-unit-find-by-criteria.query";
import { GrowingUnitViewModelFindByIdQuery } from "@/core/plant-context/application/queries/growing-unit/growing-unit-view-model-find-by-id/growing-unit-view-model-find-by-id.query";
import { GrowingUnitFindByCriteriaRequestDto } from "@/core/plant-context/transport/graphql/dtos/requests/growing-unit/growing-unit-find-by-criteria.request.dto";
import { GrowingUnitFindByIdRequestDto } from "@/core/plant-context/transport/graphql/dtos/requests/growing-unit/growing-unit-find-by-id.request.dto";
import {
	GrowingUnitResponseDto,
	PaginatedGrowingUnitResultDto,
} from "@/core/plant-context/transport/graphql/dtos/responses/growing-unit/growing-unit.response.dto";
import { GrowingUnitGraphQLMapper } from "@/core/plant-context/transport/graphql/mappers/growing-unit/growing-unit.mapper";
import { JwtAuthGuard } from "@/generic/auth/infrastructure/auth/jwt-auth.guard";
import { Roles } from "@/generic/auth/infrastructure/decorators/roles/roles.decorator";
import { RolesGuard } from "@/generic/auth/infrastructure/guards/roles/roles.guard";
import { Criteria } from "@/shared/domain/entities/criteria";
import { UserRoleEnum } from "@/shared/domain/enums/user-context/user/user-role/user-role.enum";

/**
 * GraphQL resolver for growing unit queries.
 *
 * @remarks
 * Handles all read operations for growing units. Requires authentication and appropriate roles.
 */
@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.USER)
export class GrowingUnitQueriesResolver {
	private readonly logger = new Logger(GrowingUnitQueriesResolver.name);

	constructor(
		private readonly queryBus: QueryBus,
		private readonly growingUnitGraphQLMapper: GrowingUnitGraphQLMapper,
	) {}

	/**
	 * Finds growing units that satisfy specified criteria such as filtering, sorting, and pagination.
	 *
	 * @param input - Optional input parameters containing filters, sorts, and pagination settings
	 * @returns A promise resolving to paginated results of growing units matching the provided criteria
	 */
	@Query(() => PaginatedGrowingUnitResultDto)
	async growingUnitsFindByCriteria(
		@Args("input", { nullable: true })
		input?: GrowingUnitFindByCriteriaRequestDto,
	): Promise<PaginatedGrowingUnitResultDto> {
		this.logger.log(
			`Finding growing units by criteria: ${JSON.stringify(input)}`,
		);

		// 01: Convert DTO to domain Criteria
		const criteria = new Criteria(
			input?.filters,
			input?.sorts,
			input?.pagination,
		);

		// 02: Execute query
		const result = await this.queryBus.execute(
			new GrowingUnitFindByCriteriaQuery(criteria),
		);

		// 03: Convert to response DTO
		return this.growingUnitGraphQLMapper.toPaginatedResponseDto(result);
	}

	/**
	 * Finds a growing unit by its unique identifier.
	 *
	 * @param input - Input containing the growing unit ID
	 * @returns A promise resolving to the growing unit if found, null otherwise
	 */
	@Query(() => GrowingUnitResponseDto, { nullable: true })
	async growingUnitFindById(
		@Args("input") input: GrowingUnitFindByIdRequestDto,
	): Promise<GrowingUnitResponseDto | null> {
		this.logger.log(`Finding growing unit by id: ${input.id}`);

		// 01: Execute query
		const result = await this.queryBus.execute(
			new GrowingUnitViewModelFindByIdQuery({ id: input.id }),
		);

		// 02: Convert to response DTO
		return result ? this.growingUnitGraphQLMapper.toResponseDto(result) : null;
	}
}
