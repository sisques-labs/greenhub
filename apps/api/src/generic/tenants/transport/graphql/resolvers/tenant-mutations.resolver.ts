import { UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { ClerkAuthGuard } from '@/generic/auth/infrastructure/auth/clerk-auth.guard';
import { Roles } from '@/generic/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/generic/auth/infrastructure/guards/roles/roles.guard';
import { TenantCreateCommand } from '@/generic/tenants/application/commands/tenant-create/tenant-create.command';
import { TenantDeleteCommand } from '@/generic/tenants/application/commands/tenant-delete/tenant-delete.command';
import { TenantUpdateCommand } from '@/generic/tenants/application/commands/tenant-update/tenant-update.command';
import { CreateTenantRequestDto } from '@/generic/tenants/transport/graphql/dtos/requests/create-tenant.request.dto';
import { DeleteTenantRequestDto } from '@/generic/tenants/transport/graphql/dtos/requests/delete-tenant.request.dto';
import { UpdateTenantRequestDto } from '@/generic/tenants/transport/graphql/dtos/requests/update-tenant.request.dto';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';

@Resolver()
@UseGuards(ClerkAuthGuard, RolesGuard)
export class TenantMutationsResolver {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
	) {}

	/**
	 * Creates a new tenant.
	 *
	 * @param input - Input containing tenant data
	 * @returns Success response with created tenant id
	 */
	@Mutation(() => MutationResponseDto)
	@Roles(UserRoleEnum.ADMIN)
	async createTenant(
		@Args('input') input: CreateTenantRequestDto,
	): Promise<MutationResponseDto> {
		// 01: Send the command to the command bus
		const createdTenantId = await this.commandBus.execute(
			new TenantCreateCommand({
				clerkId: input.clerkId,
				name: input.name,
				status: input.status,
			}),
		);

		// 02: Return success response
		return this.mutationResponseGraphQLMapper.toResponseDto({
			success: true,
			message: 'Tenant created successfully',
			id: createdTenantId,
		});
	}

	/**
	 * Updates an existing tenant.
	 *
	 * @param input - Input containing tenant id and data to update
	 * @returns Success response
	 */
	@Mutation(() => MutationResponseDto)
	@Roles(UserRoleEnum.ADMIN)
	async updateTenant(
		@Args('input') input: UpdateTenantRequestDto,
	): Promise<MutationResponseDto> {
		// 01: Send the command to the command bus
		await this.commandBus.execute(
			new TenantUpdateCommand({
				id: input.id,
				name: input.name,
				status: input.status,
			}),
		);

		// 02: Return success response
		return this.mutationResponseGraphQLMapper.toResponseDto({
			success: true,
			message: 'Tenant updated successfully',
			id: input.id,
		});
	}

	/**
	 * Deletes a tenant.
	 *
	 * @param input - Input containing tenant id
	 * @returns Success response
	 */
	@Mutation(() => MutationResponseDto)
	@Roles(UserRoleEnum.ADMIN)
	async deleteTenant(
		@Args('input') input: DeleteTenantRequestDto,
	): Promise<MutationResponseDto> {
		// 01: Send the command to the command bus
		await this.commandBus.execute(new TenantDeleteCommand({ id: input.id }));

		// 02: Return success response
		return this.mutationResponseGraphQLMapper.toResponseDto({
			success: true,
			message: 'Tenant deleted successfully',
			id: input.id,
		});
	}
}

