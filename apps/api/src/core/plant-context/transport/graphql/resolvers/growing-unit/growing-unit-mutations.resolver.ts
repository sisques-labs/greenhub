import { Logger, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GrowingUnitCreateCommand } from '@/core/plant-context/application/commands/growing-unit/growing-unit-create/growing-unit-create.command';
import { GrowingUnitDeleteCommand } from '@/core/plant-context/application/commands/growing-unit/growing-unit-delete/growing-unit-delete.command';
import { GrowingUnitUpdateCommand } from '@/core/plant-context/application/commands/growing-unit/growing-unit-update/growing-unit-update.command';
import { PlantAddCommand } from '@/core/plant-context/application/commands/plant/plant-add/plant-add.command';
import { PlantRemoveCommand } from '@/core/plant-context/application/commands/plant/plant-remove/plant-remove.command';
import { PlantUpdateCommand } from '@/core/plant-context/application/commands/plant/plant-update/plant-update.command';
import { GrowingUnitCreateRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/growing-unit/growing-unit-create.request.dto';
import { GrowingUnitDeleteRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/growing-unit/growing-unit-delete.request.dto';
import { GrowingUnitUpdateRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/growing-unit/growing-unit-update.request.dto';
import { PlantAddRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/plant/plant-add.request.dto';
import { PlantRemoveRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/plant/plant-remove.request.dto';
import { PlantUpdateRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/plant/plant-update.request.dto';
import { JwtAuthGuard } from '@/generic/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/generic/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/generic/auth/infrastructure/guards/roles/roles.guard';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';

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

  /**
   * Adds a new plant to a growing unit.
   *
   * @param input - Input containing plant data and growing unit ID
   * @returns A promise resolving to a mutation response with the created plant ID
   */
  @Mutation(() => MutationResponseDto)
  async plantAdd(
    @Args('input') input: PlantAddRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Adding plant with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    const createdPlantId = await this.commandBus.execute(
      new PlantAddCommand({
        growingUnitId: input.growingUnitId,
        name: input.name,
        species: input.species,
        plantedDate: input.plantedDate,
        notes: input.notes,
        status: input.status,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Plant added successfully',
      id: createdPlantId,
    });
  }

  /**
   * Updates an existing plant.
   *
   * @param input - Input containing plant ID and fields to update
   * @returns A promise resolving to a mutation response with the updated plant ID
   */
  @Mutation(() => MutationResponseDto)
  async plantUpdate(
    @Args('input') input: PlantUpdateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Updating plant with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new PlantUpdateCommand({
        id: input.id,
        name: input.name,
        species: input.species,
        plantedDate: input.plantedDate,
        notes: input.notes,
        status: input.status,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Plant updated successfully',
      id: input.id,
    });
  }

  /**
   * Removes a plant from a growing unit.
   *
   * @param input - Input containing the growing unit ID and plant ID to remove
   * @returns A promise resolving to a mutation response with the removed plant ID
   */
  @Mutation(() => MutationResponseDto)
  async plantRemove(
    @Args('input') input: PlantRemoveRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Removing plant with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new PlantRemoveCommand({
        growingUnitId: input.growingUnitId,
        plantId: input.plantId,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Plant removed successfully',
      id: input.plantId,
    });
  }
}
