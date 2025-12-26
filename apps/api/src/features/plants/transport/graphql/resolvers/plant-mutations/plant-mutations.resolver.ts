import { JwtAuthGuard } from '@/auth-context/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { TenantRoles } from '@/auth-context/auth/infrastructure/decorators/tenant-roles/tenant-roles.decorator';
import { RolesGuard } from '@/auth-context/auth/infrastructure/guards/roles/roles.guard';
import { TenantRolesGuard } from '@/auth-context/auth/infrastructure/guards/tenant-roles/tenant-roles.guard';
import { TenantGuard } from '@/auth-context/auth/infrastructure/guards/tenant/tenant.guard';
import { PlantChangeStatusCommand } from '@/features/plants/application/commands/plant-change-status/plant-change-status.command';
import { PlantCreateCommand } from '@/features/plants/application/commands/plant-create/plant-create.command';
import { PlantDeleteCommand } from '@/features/plants/application/commands/plant-delete/plant-delete.command';
import { PlantUpdateCommand } from '@/features/plants/application/commands/plant-update/plant-update.command';
import { CreatePlantRequestDto } from '@/features/plants/transport/graphql/dtos/requests/create-plant.request.dto';
import { DeletePlantRequestDto } from '@/features/plants/transport/graphql/dtos/requests/delete-plant.request.dto';
import { PlantChangeStatusRequestDto } from '@/features/plants/transport/graphql/dtos/requests/plant-change-status.request.dto';
import { UpdatePlantRequestDto } from '@/features/plants/transport/graphql/dtos/requests/update-plant.request.dto';
import { TenantMemberRoleEnum } from '@/shared/domain/enums/tenant-context/tenant-members/tenant-member-role/tenant-member-role.enum';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { Logger, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

/**
 * GraphQL resolver for plant mutations.
 *
 * @remarks
 * Handles all write operations for plants. Requires authentication, tenant context,
 * and appropriate roles. All mutations operate within the tenant context specified
 * by the x-tenant-id header.
 */
@Resolver()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard, TenantRolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.USER)
export class PlantMutationsResolver {
  private readonly logger = new Logger(PlantMutationsResolver.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
  ) {}

  /**
   * Creates a new plant.
   *
   * @param input - Input containing plant data
   * @returns A promise resolving to a mutation response with the created plant ID
   */
  @Mutation(() => MutationResponseDto)
  @TenantRoles(
    TenantMemberRoleEnum.OWNER,
    TenantMemberRoleEnum.ADMIN,
    TenantMemberRoleEnum.MEMBER,
  )
  async createPlant(
    @Args('input') input: CreatePlantRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Creating plant with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    const createdPlantId = await this.commandBus.execute(
      new PlantCreateCommand({
        containerId: input.containerId,
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
      message: 'Plant created successfully',
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
  @TenantRoles(
    TenantMemberRoleEnum.OWNER,
    TenantMemberRoleEnum.ADMIN,
    TenantMemberRoleEnum.MEMBER,
  )
  async updatePlant(
    @Args('input') input: UpdatePlantRequestDto,
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
   * Deletes a plant.
   *
   * @param input - Input containing the plant ID to delete
   * @returns A promise resolving to a mutation response with the deleted plant ID
   */
  @Mutation(() => MutationResponseDto)
  @TenantRoles(
    TenantMemberRoleEnum.OWNER,
    TenantMemberRoleEnum.ADMIN,
    TenantMemberRoleEnum.MEMBER,
  )
  async deletePlant(
    @Args('input') input: DeletePlantRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Deleting plant with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(new PlantDeleteCommand({ id: input.id }));

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Plant deleted successfully',
      id: input.id,
    });
  }

  /**
   * Changes the status of a plant.
   *
   * @param input - Input containing the plant ID and new status
   * @returns A promise resolving to a mutation response with the updated plant ID
   */
  @Mutation(() => MutationResponseDto)
  @TenantRoles(
    TenantMemberRoleEnum.OWNER,
    TenantMemberRoleEnum.ADMIN,
    TenantMemberRoleEnum.MEMBER,
  )
  async changePlantStatus(
    @Args('input') input: PlantChangeStatusRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(
      `Changing plant status with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new PlantChangeStatusCommand({
        id: input.id,
        status: input.status,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Plant status changed successfully',
      id: input.id,
    });
  }
}
