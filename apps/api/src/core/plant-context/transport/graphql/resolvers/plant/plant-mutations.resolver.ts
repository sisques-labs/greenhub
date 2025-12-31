import { Logger, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PlantAddCommand } from '@/core/plant-context/application/commands/plant/plant-add/plant-add.command';
import { PlantRemoveCommand } from '@/core/plant-context/application/commands/plant/plant-remove/plant-remove.command';
import { PlantTransplantCommand } from '@/core/plant-context/application/commands/plant/plant-transplant/plant-transplant.command';
import { PlantUpdateCommand } from '@/core/plant-context/application/commands/plant/plant-update/plant-update.command';
import { PlantAddRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/plant/plant-add.request.dto';
import { PlantRemoveRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/plant/plant-remove.request.dto';
import { PlantTransplantRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/plant/plant-transplant.request.dto';
import { PlantUpdateRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/plant/plant-update.request.dto';
import { JwtAuthGuard } from '@/generic/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/generic/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/generic/auth/infrastructure/guards/roles/roles.guard';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';

/**
 * GraphQL resolver for plant mutations.
 *
 * @remarks
 * Handles all write operations for plants. Requires authentication and appropriate roles.
 */
@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.USER)
export class PlantMutationsResolver {
	private readonly logger = new Logger(PlantMutationsResolver.name);

	constructor(
		private readonly commandBus: CommandBus,
		private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
	) {}

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

	/**
	 * Transplants a plant from one growing unit to another.
	 *
	 * @param input - Input containing the source growing unit ID, target growing unit ID, and plant ID
	 * @returns A promise resolving to a mutation response with the transplanted plant ID
	 */
	@Mutation(() => MutationResponseDto)
	async plantTransplant(
		@Args('input') input: PlantTransplantRequestDto,
	): Promise<MutationResponseDto> {
		this.logger.log(`Transplanting plant with input: ${JSON.stringify(input)}`);

		// 01: Send the command to the command bus
		await this.commandBus.execute(
			new PlantTransplantCommand({
				sourceGrowingUnitId: input.sourceGrowingUnitId,
				targetGrowingUnitId: input.targetGrowingUnitId,
				plantId: input.plantId,
			}),
		);

		// 02: Return success response
		return this.mutationResponseGraphQLMapper.toResponseDto({
			success: true,
			message: 'Plant transplanted successfully',
			id: input.plantId,
		});
	}
}
