import { PlantSpeciesCreateCommand } from '@/core/plant-species-context/application/commands/plant-species/plant-species-create/plant-species-create.command';
import { PlantSpeciesDeleteCommand } from '@/core/plant-species-context/application/commands/plant-species/plant-species-delete/plant-species-delete.command';
import { PlantSpeciesUpdateCommand } from '@/core/plant-species-context/application/commands/plant-species/plant-species-update/plant-species-update.command';
import { PlantSpeciesCreateRequestDto } from '@/core/plant-species-context/transport/graphql/dtos/requests/plant-species/plant-species-create.request.dto';
import { PlantSpeciesDeleteRequestDto } from '@/core/plant-species-context/transport/graphql/dtos/requests/plant-species/plant-species-delete.request.dto';
import { PlantSpeciesUpdateRequestDto } from '@/core/plant-species-context/transport/graphql/dtos/requests/plant-species/plant-species-update.request.dto';
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
 * GraphQL resolver for plant species mutations.
 *
 * @remarks
 * Handles all write operations for plant species. Requires authentication and appropriate roles.
 */
@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.USER)
export class PlantSpeciesMutationsResolver {
	private readonly logger = new Logger(PlantSpeciesMutationsResolver.name);

	constructor(
		private readonly commandBus: CommandBus,
		private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
	) {}

	/**
	 * Creates a new plant species.
	 *
	 * @param input - Input containing plant species data
	 * @returns A promise resolving to a mutation response with the created plant species ID
	 */
	@Mutation(() => MutationResponseDto)
	async plantSpeciesCreate(
		@Args('input') input: PlantSpeciesCreateRequestDto,
	): Promise<MutationResponseDto> {
		this.logger.log(
			`Creating plant species with input: ${JSON.stringify(input)}`,
		);

		// 01: Send the command to the command bus
		const createdPlantSpeciesId = await this.commandBus.execute(
			new PlantSpeciesCreateCommand({
				commonName: input.commonName,
				scientificName: input.scientificName,
				family: input.family,
				description: input.description,
				category: input.category,
				difficulty: input.difficulty,
				growthRate: input.growthRate,
				lightRequirements: input.lightRequirements,
				waterRequirements: input.waterRequirements,
				temperatureRange: input.temperatureRange,
				humidityRequirements: input.humidityRequirements,
				soilType: input.soilType,
				phRange: input.phRange,
				matureSize: input.matureSize,
				growthTime: input.growthTime,
				tags: input.tags,
				contributorId: input.contributorId,
			}),
		);

		// 02: Return success response
		return this.mutationResponseGraphQLMapper.toResponseDto({
			success: true,
			message: 'Plant species created successfully',
			id: createdPlantSpeciesId,
		});
	}

	/**
	 * Updates an existing plant species.
	 *
	 * @param input - Input containing plant species ID and fields to update
	 * @returns A promise resolving to a mutation response with the updated plant species ID
	 */
	@Mutation(() => MutationResponseDto)
	async plantSpeciesUpdate(
		@Args('input') input: PlantSpeciesUpdateRequestDto,
	): Promise<MutationResponseDto> {
		this.logger.log(
			`Updating plant species with input: ${JSON.stringify(input)}`,
		);

		// 01: Send the command to the command bus
		await this.commandBus.execute(
			new PlantSpeciesUpdateCommand({
				id: input.id,
				commonName: input.commonName,
				scientificName: input.scientificName,
				family: input.family,
				description: input.description,
				category: input.category,
				difficulty: input.difficulty,
				growthRate: input.growthRate,
				lightRequirements: input.lightRequirements,
				waterRequirements: input.waterRequirements,
				temperatureRange: input.temperatureRange,
				humidityRequirements: input.humidityRequirements,
				soilType: input.soilType,
				phRange: input.phRange,
				matureSize: input.matureSize,
				growthTime: input.growthTime,
				tags: input.tags,
			}),
		);

		// 02: Return success response
		return this.mutationResponseGraphQLMapper.toResponseDto({
			success: true,
			message: 'Plant species updated successfully',
			id: input.id,
		});
	}

	/**
	 * Deletes a plant species.
	 *
	 * @param input - Input containing the plant species ID to delete
	 * @returns A promise resolving to a mutation response
	 */
	@Mutation(() => MutationResponseDto)
	async plantSpeciesDelete(
		@Args('input') input: PlantSpeciesDeleteRequestDto,
	): Promise<MutationResponseDto> {
		this.logger.log(
			`Deleting plant species with input: ${JSON.stringify(input)}`,
		);

		// 01: Send the command to the command bus
		await this.commandBus.execute(
			new PlantSpeciesDeleteCommand({
				id: input.id,
			}),
		);

		// 02: Return success response
		return this.mutationResponseGraphQLMapper.toResponseDto({
			success: true,
			message: 'Plant species deleted successfully',
			id: input.id,
		});
	}
}
