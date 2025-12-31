import { QueryBus } from "@nestjs/cqrs";
import { Query, Resolver } from "@nestjs/graphql";
import { HealthCheckQuery } from "@/support/health/application/queries/health-check/health-check.query";
import { HealthResponseDto } from "@/support/health/transport/graphql/dtos/responses/health.response.dto";
import { HealthGraphQLMapper } from "@/support/health/transport/graphql/mappers/health.mapper";

@Resolver()
export class HealthQueryResolver {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly healthGraphQLMapper: HealthGraphQLMapper,
	) {}

	/**
	 * Finds health that satisfy specified criteria such as filtering, sorting, and pagination.
	 *
	 * @param {HealthFindByCriteriaRequestDto} [input] - Optional input parameters containing filters, sorts, and pagination settings.
	 * @returns {Promise<PaginatedHealthResultDto>} A promise resolving to paginated results of health matching the provided criteria.
	 */
	@Query(() => HealthResponseDto)
	async healthCheck(): Promise<HealthResponseDto> {
		// 01: Execute query
		const result = await this.queryBus.execute(new HealthCheckQuery());

		// 02: Convert to response DTO
		return this.healthGraphQLMapper.toResponseDto(result);
	}
}
