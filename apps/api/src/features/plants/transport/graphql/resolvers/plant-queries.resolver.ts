import { JwtAuthGuard } from '@/auth-context/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/auth-context/auth/infrastructure/guards/roles/roles.guard';
import { TenantGuard } from '@/auth-context/auth/infrastructure/guards/tenant/tenant.guard';
import { TenantRolesGuard } from '@/auth-context/auth/infrastructure/guards/tenant-roles/tenant-roles.guard';
import { PlantViewModelFindByIdQuery } from '@/features/plants/application/queries/plant-view-model-find-by-id/plant-view-model-find-by-id.query';
import { FindPlantsByCriteriaQuery } from '@/features/plants/application/queries/find-plants-by-criteria/find-plants-by-criteria.query';
import { PlantFindByCriteriaRequestDto } from '@/features/plants/transport/graphql/dtos/requests/plant-find-by-criteria.request.dto';
import { PlantFindByIdRequestDto } from '@/features/plants/transport/graphql/dtos/requests/plant-find-by-id.request.dto';
import {
  PlantResponseDto,
  PaginatedPlantResultDto,
} from '@/features/plants/transport/graphql/dtos/responses/plant.response.dto';
import { PlantGraphQLMapper } from '@/features/plants/transport/graphql/mappers/plant.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { Logger, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

/**
 * GraphQL resolver for plant queries.
 *
 * @remarks
 * Handles all read operations for plants. Requires authentication, tenant context,
 * and appropriate roles. All queries operate within the tenant context specified
 * by the x-tenant-id header.
 */
@Resolver()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard, TenantRolesGuard)
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
      new PlantViewModelFindByIdQuery({ id: input.id }),
    );

    // 02: Convert to response DTO
    return result ? this.plantGraphQLMapper.toResponseDto(result) : null;
  }
}
