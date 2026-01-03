import { UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { ClerkAuthGuard } from '@/generic/auth/infrastructure/auth/clerk-auth.guard';
import { Roles } from '@/generic/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/generic/auth/infrastructure/guards/roles/roles.guard';
import { FindTenantsByCriteriaQuery } from '@/generic/tenants/application/queries/find-tenants-by-criteria/find-tenants-by-criteria.query';
import { TenantViewModelFindByIdQuery } from '@/generic/tenants/application/queries/tenant-view-model-find-by-id/tenant-view-model-find-by-id.query';
import { TenantFindByCriteriaRequestDto } from '@/generic/tenants/transport/graphql/dtos/requests/tenant-find-by-criteria.request.dto';
import { TenantFindByIdRequestDto } from '@/generic/tenants/transport/graphql/dtos/requests/tenant-find-by-id.request.dto';
import {
	PaginatedTenantResultDto,
	TenantResponseDto,
} from '@/generic/tenants/transport/graphql/dtos/responses/tenant.response.dto';
import { TenantGraphQLMapper } from '@/generic/tenants/transport/graphql/mappers/tenant.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';

@Resolver()
@UseGuards(ClerkAuthGuard, RolesGuard)
export class TenantQueriesResolver {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly tenantGraphQLMapper: TenantGraphQLMapper,
	) {}

	/**
	 * Finds tenants that satisfy specified criteria such as filtering, sorting, and pagination.
	 *
	 * @param input - Optional input parameters containing filters, sorts, and pagination settings
	 * @returns A promise resolving to paginated results of tenants matching the provided criteria
	 */
	@Query(() => PaginatedTenantResultDto)
	@Roles(UserRoleEnum.ADMIN)
	async tenantsFindByCriteria(
		@Args('input', { nullable: true })
		input?: TenantFindByCriteriaRequestDto,
	): Promise<PaginatedTenantResultDto> {
		// 01: Convert DTO to domain Criteria
		const criteria = new Criteria(
			input?.filters,
			input?.sorts,
			input?.pagination,
		);

		// 02: Execute query
		const result = await this.queryBus.execute(
			new FindTenantsByCriteriaQuery(criteria),
		);

		// 03: Convert to response DTO
		return this.tenantGraphQLMapper.toPaginatedResponseDto(result);
	}

	/**
	 * Finds a tenant by its unique identifier.
	 *
	 * @param input - Input containing the tenant ID
	 * @returns A promise resolving to the tenant if found, null otherwise
	 */
	@Query(() => TenantResponseDto, { nullable: true })
	@Roles(UserRoleEnum.ADMIN)
	async tenantFindById(
		@Args('input') input: TenantFindByIdRequestDto,
	): Promise<TenantResponseDto | null> {
		// 01: Execute query
		const result = await this.queryBus.execute(
			new TenantViewModelFindByIdQuery({ id: input.id }),
		);

		// 02: Convert to response DTO
		return result ? this.tenantGraphQLMapper.toResponseDto(result) : null;
	}
}

