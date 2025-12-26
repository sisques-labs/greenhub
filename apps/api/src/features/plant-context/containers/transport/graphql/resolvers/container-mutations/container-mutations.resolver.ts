import { JwtAuthGuard } from '@/auth-context/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { TenantRoles } from '@/auth-context/auth/infrastructure/decorators/tenant-roles/tenant-roles.decorator';
import { RolesGuard } from '@/auth-context/auth/infrastructure/guards/roles/roles.guard';
import { TenantRolesGuard } from '@/auth-context/auth/infrastructure/guards/tenant-roles/tenant-roles.guard';
import { TenantGuard } from '@/auth-context/auth/infrastructure/guards/tenant/tenant.guard';
import { ContainerCreateCommand } from '@/features/plant-context/containers/application/commands/container-create/container-create.command';
import { ContainerDeleteCommand } from '@/features/plant-context/containers/application/commands/container-delete/container-delete.command';
import { ContainerUpdateCommand } from '@/features/plant-context/containers/application/commands/container-update/container-update.command';
import { CreateContainerRequestDto } from '@/features/plant-context/containers/transport/graphql/dtos/requests/create-container.request.dto';
import { DeleteContainerRequestDto } from '@/features/plant-context/containers/transport/graphql/dtos/requests/delete-container.request.dto';
import { UpdateContainerRequestDto } from '@/features/plant-context/containers/transport/graphql/dtos/requests/update-container.request.dto';
import { TenantMemberRoleEnum } from '@/shared/domain/enums/tenant-context/tenant-members/tenant-member-role/tenant-member-role.enum';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { Logger, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

/**
 * GraphQL resolver for container mutations.
 *
 * @remarks
 * Handles all write operations for containers. Requires authentication, tenant context,
 * and appropriate roles. All mutations operate within the tenant context specified
 * by the x-tenant-id header.
 */
@Resolver()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard, TenantRolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.USER)
export class ContainerMutationsResolver {
  private readonly logger = new Logger(ContainerMutationsResolver.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
  ) {}

  /**
   * Creates a new container.
   *
   * @param input - Input containing container data
   * @returns A promise resolving to a mutation response with the created container ID
   */
  @Mutation(() => MutationResponseDto)
  @TenantRoles(
    TenantMemberRoleEnum.OWNER,
    TenantMemberRoleEnum.ADMIN,
    TenantMemberRoleEnum.MEMBER,
  )
  async createContainer(
    @Args('input') input: CreateContainerRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Creating container with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    const createdContainerId = await this.commandBus.execute(
      new ContainerCreateCommand({
        name: input.name,
        type: input.type,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Container created successfully',
      id: createdContainerId,
    });
  }

  /**
   * Updates an existing container.
   *
   * @param input - Input containing container ID and fields to update
   * @returns A promise resolving to a mutation response with the updated container ID
   */
  @Mutation(() => MutationResponseDto)
  @TenantRoles(
    TenantMemberRoleEnum.OWNER,
    TenantMemberRoleEnum.ADMIN,
    TenantMemberRoleEnum.MEMBER,
  )
  async updateContainer(
    @Args('input') input: UpdateContainerRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Updating container with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new ContainerUpdateCommand({
        id: input.id,
        name: input.name,
        type: input.type,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Container updated successfully',
      id: input.id,
    });
  }

  /**
   * Deletes a container.
   *
   * @param input - Input containing the container ID to delete
   * @returns A promise resolving to a mutation response with the deleted container ID
   */
  @Mutation(() => MutationResponseDto)
  @TenantRoles(
    TenantMemberRoleEnum.OWNER,
    TenantMemberRoleEnum.ADMIN,
    TenantMemberRoleEnum.MEMBER,
  )
  async deleteContainer(
    @Args('input') input: DeleteContainerRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Deleting container with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(new ContainerDeleteCommand({ id: input.id }));

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Container deleted successfully',
      id: input.id,
    });
  }
}
