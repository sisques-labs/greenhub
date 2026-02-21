import { CommandBus } from '@nestjs/cqrs';

import { PlantSpeciesCreateCommand } from '@/core/plant-species-context/application/commands/plant-species/plant-species-create/plant-species-create.command';
import { PlantSpeciesDeleteCommand } from '@/core/plant-species-context/application/commands/plant-species/plant-species-delete/plant-species-delete.command';
import { PlantSpeciesUpdateCommand } from '@/core/plant-species-context/application/commands/plant-species/plant-species-update/plant-species-update.command';
import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { PlantSpeciesGrowthRateEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-growth-rate/plant-species-growth-rate.enum';
import { PlantSpeciesLightRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-light-requirements/plant-species-light-requirements.enum';
import { PlantSpeciesWaterRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-water-requirements/plant-species-water-requirements.enum';
import { PlantSpeciesCreateRequestDto } from '@/core/plant-species-context/transport/graphql/dtos/requests/plant-species/plant-species-create.request.dto';
import { PlantSpeciesDeleteRequestDto } from '@/core/plant-species-context/transport/graphql/dtos/requests/plant-species/plant-species-delete.request.dto';
import { PlantSpeciesUpdateRequestDto } from '@/core/plant-species-context/transport/graphql/dtos/requests/plant-species/plant-species-update.request.dto';
import { PlantSpeciesMutationsResolver } from '@/core/plant-species-context/transport/graphql/resolvers/plant-species/plant-species-mutations.resolver';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';

describe('PlantSpeciesMutationsResolver', () => {
	let resolver: PlantSpeciesMutationsResolver;
	let mockCommandBus: jest.Mocked<CommandBus>;
	let mockMutationResponseGraphQLMapper: jest.Mocked<MutationResponseGraphQLMapper>;

	const baseInput: PlantSpeciesCreateRequestDto = {
		commonName: 'Tomato',
		scientificName: 'Solanum lycopersicum',
		category: PlantSpeciesCategoryEnum.VEGETABLE,
		difficulty: PlantSpeciesDifficultyEnum.EASY,
		growthRate: PlantSpeciesGrowthRateEnum.FAST,
		lightRequirements: PlantSpeciesLightRequirementsEnum.FULL_SUN,
		waterRequirements: PlantSpeciesWaterRequirementsEnum.HIGH,
	};

	beforeEach(() => {
		mockCommandBus = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<CommandBus>;

		mockMutationResponseGraphQLMapper = {
			toResponseDto: jest.fn(),
		} as unknown as jest.Mocked<MutationResponseGraphQLMapper>;

		resolver = new PlantSpeciesMutationsResolver(
			mockCommandBus,
			mockMutationResponseGraphQLMapper,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('plantSpeciesCreate', () => {
		it('should create plant species successfully', async () => {
			const plantSpeciesId = '123e4567-e89b-12d3-a456-426614174000';
			const input: PlantSpeciesCreateRequestDto = { ...baseInput };

			const mutationResponse: MutationResponseDto = {
				success: true,
				message: 'Plant species created successfully',
				id: plantSpeciesId,
			};

			mockCommandBus.execute.mockResolvedValue(plantSpeciesId);
			mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
				mutationResponse,
			);

			const result = await resolver.plantSpeciesCreate(input);

			expect(result).toBe(mutationResponse);
			expect(mockCommandBus.execute).toHaveBeenCalledWith(
				expect.any(PlantSpeciesCreateCommand),
			);
			const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
			expect(command).toBeInstanceOf(PlantSpeciesCreateCommand);
			expect(command.commonName.value).toBe('Tomato');
			expect(command.scientificName.value).toBe('Solanum lycopersicum');
			expect(
				mockMutationResponseGraphQLMapper.toResponseDto,
			).toHaveBeenCalledWith({
				success: true,
				message: 'Plant species created successfully',
				id: plantSpeciesId,
			});
		});

		it('should create plant species with all optional fields', async () => {
			const plantSpeciesId = '123e4567-e89b-12d3-a456-426614174000';
			const input: PlantSpeciesCreateRequestDto = {
				...baseInput,
				family: 'Solanaceae',
				description: 'A common garden vegetable',
				temperatureRange: { min: 15, max: 30 },
				growthTime: 80,
				tags: ['vegetable', 'tomato'],
			};

			const mutationResponse: MutationResponseDto = {
				success: true,
				message: 'Plant species created successfully',
				id: plantSpeciesId,
			};

			mockCommandBus.execute.mockResolvedValue(plantSpeciesId);
			mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
				mutationResponse,
			);

			const result = await resolver.plantSpeciesCreate(input);

			expect(result).toBe(mutationResponse);
			expect(mockCommandBus.execute).toHaveBeenCalledWith(
				expect.any(PlantSpeciesCreateCommand),
			);
		});
	});

	describe('plantSpeciesUpdate', () => {
		it('should update plant species successfully', async () => {
			const plantSpeciesId = '123e4567-e89b-12d3-a456-426614174000';
			const input: PlantSpeciesUpdateRequestDto = {
				id: plantSpeciesId,
				...baseInput,
				commonName: 'Cherry Tomato',
			};

			const mutationResponse: MutationResponseDto = {
				success: true,
				message: 'Plant species updated successfully',
				id: plantSpeciesId,
			};

			mockCommandBus.execute.mockResolvedValue(undefined);
			mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
				mutationResponse,
			);

			const result = await resolver.plantSpeciesUpdate(input);

			expect(result).toBe(mutationResponse);
			expect(mockCommandBus.execute).toHaveBeenCalledWith(
				expect.any(PlantSpeciesUpdateCommand),
			);
			const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
			expect(command).toBeInstanceOf(PlantSpeciesUpdateCommand);
			expect(command.id.value).toBe(plantSpeciesId);
			expect(command.commonName?.value).toBe('Cherry Tomato');
			expect(
				mockMutationResponseGraphQLMapper.toResponseDto,
			).toHaveBeenCalledWith({
				success: true,
				message: 'Plant species updated successfully',
				id: plantSpeciesId,
			});
		});
	});

	describe('plantSpeciesDelete', () => {
		it('should delete plant species successfully', async () => {
			const plantSpeciesId = '123e4567-e89b-12d3-a456-426614174000';
			const input: PlantSpeciesDeleteRequestDto = {
				id: plantSpeciesId,
			};

			const mutationResponse: MutationResponseDto = {
				success: true,
				message: 'Plant species deleted successfully',
				id: plantSpeciesId,
			};

			mockCommandBus.execute.mockResolvedValue(undefined);
			mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
				mutationResponse,
			);

			const result = await resolver.plantSpeciesDelete(input);

			expect(result).toBe(mutationResponse);
			expect(mockCommandBus.execute).toHaveBeenCalledWith(
				expect.any(PlantSpeciesDeleteCommand),
			);
			const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
			expect(command).toBeInstanceOf(PlantSpeciesDeleteCommand);
			expect(command.id.value).toBe(plantSpeciesId);
			expect(
				mockMutationResponseGraphQLMapper.toResponseDto,
			).toHaveBeenCalledWith({
				success: true,
				message: 'Plant species deleted successfully',
				id: plantSpeciesId,
			});
		});
	});
});
