import { PlantFindByIdQuery } from '@/core/plant-context/application/queries/plant/plant-find-by-id/plant-find-by-id.query';
import { PlantFindByIdRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/plant/plant-find-by-id.request.dto';
import { PlantResponseDto } from '@/core/plant-context/transport/graphql/dtos/responses/plant/plant.response.dto';
import { PlantGraphQLMapper } from '@/core/plant-context/transport/graphql/mappers/plant/plant.mapper';
import { JwtAuthGuard } from '@/generic/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/generic/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/generic/auth/infrastructure/guards/roles/roles.guard';
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
