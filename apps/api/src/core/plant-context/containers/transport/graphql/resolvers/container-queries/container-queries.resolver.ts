import { ContainerViewModelFindByIdQuery } from '@/core/plant-context/containers/application/queries/container-view-model-find-by-id/container-view-model-find-by-id.query';
import { FindContainersByCriteriaQuery } from '@/core/plant-context/containers/application/queries/find-containers-by-criteria/find-containers-by-criteria.query';
import { ContainerFindByCriteriaRequestDto } from '@/core/plant-context/containers/transport/graphql/dtos/requests/container-find-by-criteria.request.dto';
import { ContainerFindByIdRequestDto } from '@/core/plant-context/containers/transport/graphql/dtos/requests/container-find-by-id.request.dto';
import {
  ContainerResponseDto,
  PaginatedContainerResultDto,
} from '@/core/plant-context/containers/transport/graphql/dtos/responses/container.response.dto';
import { ContainerGraphQLMapper } from '@/core/plant-context/containers/transport/graphql/mappers/container.mapper';
import { JwtAuthGuard } from '@/generic/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/generic/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/generic/auth/infrastructure/guards/roles/roles.guard';
import { Criteria } from '@/shared/domain/entities/criteria';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { Logger, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

/**
 * GraphQL resolver for container queries.
 *
 * @remarks
 * Handles all read operations for containers. Requires authentication and appropriate roles.
 */
@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.USER)
export class ContainerQueriesResolver {
  private readonly logger = new Logger(ContainerQueriesResolver.name);

  constructor(
    private readonly queryBus: QueryBus,
    private readonly containerGraphQLMapper: ContainerGraphQLMapper,
  ) {}

  /**
   * Finds containers that satisfy specified criteria such as filtering, sorting, and pagination.
   *
   * @param input - Optional input parameters containing filters, sorts, and pagination settings
   * @returns A promise resolving to paginated results of containers matching the provided criteria
   */
  @Query(() => PaginatedContainerResultDto)
  async containersFindByCriteria(
    @Args('input', { nullable: true })
    input?: ContainerFindByCriteriaRequestDto,
  ): Promise<PaginatedContainerResultDto> {
    this.logger.log(`Finding containers by criteria: ${JSON.stringify(input)}`);

    // 01: Convert DTO to domain Criteria
    const criteria = new Criteria(
      input?.filters,
      input?.sorts,
      input?.pagination,
    );

    // 02: Execute query
    const result = await this.queryBus.execute(
      new FindContainersByCriteriaQuery(criteria),
    );

    // 03: Convert to response DTO
    return this.containerGraphQLMapper.toPaginatedResponseDto(result);
  }

  /**
   * Finds a container by its unique identifier.
   *
   * @param input - Input containing the container ID
   * @returns A promise resolving to the container if found, null otherwise
   */
  @Query(() => ContainerResponseDto, { nullable: true })
  async containerFindById(
    @Args('input') input: ContainerFindByIdRequestDto,
  ): Promise<ContainerResponseDto | null> {
    this.logger.log(`Finding container by id: ${input.id}`);

    // 01: Execute query
    const result = await this.queryBus.execute(
      new ContainerViewModelFindByIdQuery({ id: input.id }),
    );

    // 02: Convert to response DTO
    return result ? this.containerGraphQLMapper.toResponseDto(result) : null;
  }
}
