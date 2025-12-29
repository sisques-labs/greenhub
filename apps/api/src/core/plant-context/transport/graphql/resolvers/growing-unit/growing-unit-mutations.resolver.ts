import { GrowingUnitCreateCommand } from '@/core/plant-context/application/commands/growing-unit/growing-unit-create/growing-unit-create.command';
import { GrowingUnitDeleteCommand } from '@/core/plant-context/application/commands/growing-unit/growing-unit-delete/growing-unit-delete.command';
import { GrowingUnitUpdateCommand } from '@/core/plant-context/application/commands/growing-unit/growing-unit-update/growing-unit-update.command';
import { GrowingUnitCreateRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/growing-unit/growing-unit-create.request.dto';
import { GrowingUnitDeleteRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/growing-unit/growing-unit-delete.request.dto';
import { GrowingUnitUpdateRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/growing-unit/growing-unit-update.request.dto';
import { JwtAuthGuard } from '@/generic/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/generic/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/generic/auth/infrastructure/guards/roles/roles.guard';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { Logger, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

/**
 * GraphQL resolver for growing unit mutations.
 *
 * @remarks
 * Handles all write operations for growing units. Requires authentication and appropriate roles.
 */
@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.USER)
export class GrowingUnitMutationsResolver {
  private readonly logger = new Logger(GrowingUnitMutationsResolver.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
  ) {}

  /**
   * Creates a new growing unit.
   *
   * @param input - Input containing growing unit data
   * @returns A promise resolving to a mutation response with the created growing unit ID
   */
  @Mutation(() => MutationResponseDto)
  async growingUnitCreate(
    @Args('input') input: GrowingUnitCreateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(
      `Creating growing unit with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    const createdGrowingUnitId = await this.commandBus.execute(
      new GrowingUnitCreateCommand({
        name: input.name,
        type: input.type,
        capacity: input.capacity,
        length: input.length,
        width: input.width,
        height: input.height,
        unit: input.unit,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Growing unit created successfully',
      id: createdGrowingUnitId,
    });
  }

  /**
   * Updates an existing growing unit.
   *
   * @param input - Input containing growing unit ID and fields to update
   * @returns A promise resolving to a mutation response with the updated growing unit ID
   */
  @Mutation(() => MutationResponseDto)
  async growingUnitUpdate(
    @Args('input') input: GrowingUnitUpdateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(
      `Updating growing unit with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new GrowingUnitUpdateCommand({
        id: input.id,
        name: input.name,
        type: input.type,
        capacity: input.capacity,
        dimensions:
          input.length && input.width && input.height && input.unit
            ? {
                length: input.length,
                width: input.width,
                height: input.height,
                unit: input.unit,
              }
            : null,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Growing unit updated successfully',
      id: input.id,
    });
  }

  /**
   * Deletes a growing unit.
   *
   * @param input - Input containing the growing unit ID to delete
   * @returns A promise resolving to a mutation response with the deleted growing unit ID
   */
  @Mutation(() => MutationResponseDto)
  async growingUnitDelete(
    @Args('input') input: GrowingUnitDeleteRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(
      `Deleting growing unit with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new GrowingUnitDeleteCommand({ id: input.id }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Growing unit deleted successfully',
      id: input.id,
    });
  }
}
