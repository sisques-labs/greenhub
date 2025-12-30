import { JwtAuthGuard } from '@/generic/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/generic/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/generic/auth/infrastructure/guards/roles/roles.guard';
import { OverviewFindViewModelQuery } from '@/generic/overview/application/queries/overview-find-view-model/overview-find-view-model.query';
import { OverviewResponseDto } from '@/generic/overview/transport/graphql/dtos/responses/overview.response.dto';
import { OverviewGraphQLMapper } from '@/generic/overview/transport/graphql/mappers/overview.mapper';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { Logger, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Query, Resolver } from '@nestjs/graphql';

/**
 * GraphQL resolver for overview queries.
 *
 * @remarks
 * Handles all read operations for overview. Requires authentication and appropriate roles.
 * Since there is only one overview entity, queries do not require parameters.
 */
@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.USER)
export class OverviewQueriesResolver {
  private readonly logger = new Logger(OverviewQueriesResolver.name);

  constructor(
    private readonly queryBus: QueryBus,
    private readonly overviewGraphQLMapper: OverviewGraphQLMapper,
  ) {}

  /**
   * Finds the overview with all system metrics.
   *
   * @returns A promise resolving to the overview if found, null otherwise
   */
  @Query(() => OverviewResponseDto, { nullable: true })
  async findOverview(): Promise<OverviewResponseDto | null> {
    this.logger.log('Finding overview');

    // 01: Execute query
    const result = await this.queryBus.execute(
      new OverviewFindViewModelQuery(),
    );

    // 02: Convert to response DTO
    return result ? this.overviewGraphQLMapper.toResponseDto(result) : null;
  }
}
