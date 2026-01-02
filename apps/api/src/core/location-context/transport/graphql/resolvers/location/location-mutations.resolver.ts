import { Logger, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { LocationCreateCommand } from '@/core/location-context/application/commands/location/location-create/location-create.command';
import { LocationDeleteCommand } from '@/core/location-context/application/commands/location/location-delete/location-delete.command';
import { LocationUpdateCommand } from '@/core/location-context/application/commands/location/location-update/location-update.command';
import { LocationCreateRequestDto } from '@/core/location-context/transport/graphql/dtos/requests/location/location-create.request.dto';
import { LocationDeleteRequestDto } from '@/core/location-context/transport/graphql/dtos/requests/location/location-delete.request.dto';
import { LocationUpdateRequestDto } from '@/core/location-context/transport/graphql/dtos/requests/location/location-update.request.dto';
import { JwtAuthGuard } from '@/generic/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/generic/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/generic/auth/infrastructure/guards/roles/roles.guard';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';

/**
 * GraphQL resolver for location mutations.
 *
 * @remarks
 * Handles all write operations for locations. Requires authentication and appropriate roles.
 */
@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.USER)
export class LocationMutationsResolver {
	private readonly logger = new Logger(LocationMutationsResolver.name);

	constructor(
		private readonly commandBus: CommandBus,
		private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
	) {}

	/**
	 * Creates a new location.
	 *
	 * @param input - Input containing location data
	 * @returns A promise resolving to a mutation response with the created location ID
	 */
	@Mutation(() => MutationResponseDto)
	async createLocation(
		@Args('input') input: LocationCreateRequestDto,
	): Promise<MutationResponseDto> {
		this.logger.log(
			`Creating location with input: ${JSON.stringify(input)}`,
		);

		// 01: Send the command to the command bus
		const createdLocationId = await this.commandBus.execute(
			new LocationCreateCommand({
				name: input.name,
				type: input.type,
				description: input.description,
			}),
		);

		// 02: Return success response
		return this.mutationResponseGraphQLMapper.toResponseDto({
			success: true,
			message: 'Location created successfully',
			id: createdLocationId,
		});
	}

	/**
	 * Updates an existing location.
	 *
	 * @param input - Input containing location ID and fields to update
	 * @returns A promise resolving to a mutation response with the updated location ID
	 */
	@Mutation(() => MutationResponseDto)
	async updateLocation(
		@Args('input') input: LocationUpdateRequestDto,
	): Promise<MutationResponseDto> {
		this.logger.log(
			`Updating location with input: ${JSON.stringify(input)}`,
		);

		// 01: Send the command to the command bus
		await this.commandBus.execute(
			new LocationUpdateCommand({
				id: input.id,
				name: input.name,
				type: input.type,
				description: input.description,
			}),
		);

		// 02: Return success response
		return this.mutationResponseGraphQLMapper.toResponseDto({
			success: true,
			message: 'Location updated successfully',
			id: input.id,
		});
	}

	/**
	 * Deletes a location.
	 *
	 * @param input - Input containing location ID
	 * @returns A promise resolving to a mutation response with the deleted location ID
	 */
	@Mutation(() => MutationResponseDto)
	async deleteLocation(
		@Args('input') input: LocationDeleteRequestDto,
	): Promise<MutationResponseDto> {
		this.logger.log(
			`Deleting location with input: ${JSON.stringify(input)}`,
		);

		// 01: Send the command to the command bus
		await this.commandBus.execute(
			new LocationDeleteCommand({ id: input.id }),
		);

		// 02: Return success response
		return this.mutationResponseGraphQLMapper.toResponseDto({
			success: true,
			message: 'Location deleted successfully',
			id: input.id,
		});
	}
}

