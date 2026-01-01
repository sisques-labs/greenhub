import { CommandBus } from '@nestjs/cqrs';
import { PlantAddCommand } from '@/core/plant-context/application/commands/plant/plant-add/plant-add.command';
import { PlantRemoveCommand } from '@/core/plant-context/application/commands/plant/plant-remove/plant-remove.command';
import { PlantTransplantCommand } from '@/core/plant-context/application/commands/plant/plant-transplant/plant-transplant.command';
import { PlantUpdateCommand } from '@/core/plant-context/application/commands/plant/plant-update/plant-update.command';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { PlantAddRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/plant/plant-add.request.dto';
import { PlantRemoveRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/plant/plant-remove.request.dto';
import { PlantTransplantRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/plant/plant-transplant.request.dto';
import { PlantUpdateRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/plant/plant-update.request.dto';
import { PlantMutationsResolver } from '@/core/plant-context/transport/graphql/resolvers/plant/plant-mutations.resolver';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';

describe('PlantMutationsResolver', () => {
	let resolver: PlantMutationsResolver;
	let mockCommandBus: jest.Mocked<CommandBus>;
	let mockMutationResponseGraphQLMapper: jest.Mocked<MutationResponseGraphQLMapper>;

	beforeEach(() => {
		mockCommandBus = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<CommandBus>;

		mockMutationResponseGraphQLMapper = {
			toResponseDto: jest.fn(),
		} as unknown as jest.Mocked<MutationResponseGraphQLMapper>;

		resolver = new PlantMutationsResolver(
			mockCommandBus,
			mockMutationResponseGraphQLMapper,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('plantAdd', () => {
		it('should add plant successfully', async () => {
			const plantId = '123e4567-e89b-12d3-a456-426614174000';
			const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';
			const input: PlantAddRequestDto = {
				growingUnitId: growingUnitId,
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: new Date('2024-01-15'),
				notes: 'Keep in indirect sunlight',
				status: PlantStatusEnum.PLANTED,
			};

			const mutationResponse: MutationResponseDto = {
				success: true,
				message: 'Plant added successfully',
				id: plantId,
			};

			mockCommandBus.execute.mockResolvedValue(plantId);
			mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
				mutationResponse,
			);

			const result = await resolver.plantAdd(input);

			expect(result).toBe(mutationResponse);
			expect(mockCommandBus.execute).toHaveBeenCalledWith(
				expect.any(PlantAddCommand),
			);
			const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
			expect(command).toBeInstanceOf(PlantAddCommand);
			expect(command.growingUnitId.value).toBe(growingUnitId);
			expect(command.name.value).toBe('Basil');
			expect(command.species.value).toBe('Ocimum basilicum');
			expect(
				mockMutationResponseGraphQLMapper.toResponseDto,
			).toHaveBeenCalledWith({
				success: true,
				message: 'Plant added successfully',
				id: plantId,
			});
		});

		it('should add plant with minimal data', async () => {
			const plantId = '123e4567-e89b-12d3-a456-426614174000';
			const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';
			const input: PlantAddRequestDto = {
				growingUnitId: growingUnitId,
				name: 'Basil',
				species: 'Ocimum basilicum',
			};

			const mutationResponse: MutationResponseDto = {
				success: true,
				message: 'Plant added successfully',
				id: plantId,
			};

			mockCommandBus.execute.mockResolvedValue(plantId);
			mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
				mutationResponse,
			);

			const result = await resolver.plantAdd(input);

			expect(result).toBe(mutationResponse);
			expect(mockCommandBus.execute).toHaveBeenCalledWith(
				expect.any(PlantAddCommand),
			);
		});
	});

	describe('plantUpdate', () => {
		it('should update plant successfully', async () => {
			const plantId = '123e4567-e89b-12d3-a456-426614174000';
			const input: PlantUpdateRequestDto = {
				id: plantId,
				name: 'Basil Updated',
				species: 'Ocimum basilicum',
				status: PlantStatusEnum.GROWING,
			};

			const mutationResponse: MutationResponseDto = {
				success: true,
				message: 'Plant updated successfully',
				id: plantId,
			};

			mockCommandBus.execute.mockResolvedValue(undefined);
			mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
				mutationResponse,
			);

			const result = await resolver.plantUpdate(input);

			expect(result).toBe(mutationResponse);
			expect(mockCommandBus.execute).toHaveBeenCalledWith(
				expect.any(PlantUpdateCommand),
			);
			const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
			expect(command).toBeInstanceOf(PlantUpdateCommand);
			expect(command.id.value).toBe(plantId);
			expect(command.name?.value).toBe('Basil Updated');
			expect(
				mockMutationResponseGraphQLMapper.toResponseDto,
			).toHaveBeenCalledWith({
				success: true,
				message: 'Plant updated successfully',
				id: plantId,
			});
		});
	});

	describe('plantRemove', () => {
		it('should remove plant successfully', async () => {
			const plantId = '123e4567-e89b-12d3-a456-426614174000';
			const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';
			const input: PlantRemoveRequestDto = {
				growingUnitId: growingUnitId,
				plantId: plantId,
			};

			const mutationResponse: MutationResponseDto = {
				success: true,
				message: 'Plant removed successfully',
				id: plantId,
			};

			mockCommandBus.execute.mockResolvedValue(undefined);
			mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
				mutationResponse,
			);

			const result = await resolver.plantRemove(input);

			expect(result).toBe(mutationResponse);
			expect(mockCommandBus.execute).toHaveBeenCalledWith(
				expect.any(PlantRemoveCommand),
			);
			const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
			expect(command).toBeInstanceOf(PlantRemoveCommand);
			expect(command.growingUnitId.value).toBe(growingUnitId);
			expect(command.plantId.value).toBe(plantId);
			expect(
				mockMutationResponseGraphQLMapper.toResponseDto,
			).toHaveBeenCalledWith({
				success: true,
				message: 'Plant removed successfully',
				id: plantId,
			});
		});
	});

	describe('plantTransplant', () => {
		it('should transplant plant successfully', async () => {
			const plantId = '123e4567-e89b-12d3-a456-426614174000';
			const sourceGrowingUnitId = '223e4567-e89b-12d3-a456-426614174000';
			const targetGrowingUnitId = '323e4567-e89b-12d3-a456-426614174000';
			const input: PlantTransplantRequestDto = {
				sourceGrowingUnitId: sourceGrowingUnitId,
				targetGrowingUnitId: targetGrowingUnitId,
				plantId: plantId,
			};

			const mutationResponse: MutationResponseDto = {
				success: true,
				message: 'Plant transplanted successfully',
				id: plantId,
			};

			mockCommandBus.execute.mockResolvedValue(undefined);
			mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
				mutationResponse,
			);

			const result = await resolver.plantTransplant(input);

			expect(result).toBe(mutationResponse);
			expect(mockCommandBus.execute).toHaveBeenCalledWith(
				expect.any(PlantTransplantCommand),
			);
			const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
			expect(command).toBeInstanceOf(PlantTransplantCommand);
			expect(command.sourceGrowingUnitId.value).toBe(sourceGrowingUnitId);
			expect(command.targetGrowingUnitId.value).toBe(targetGrowingUnitId);
			expect(command.plantId.value).toBe(plantId);
			expect(
				mockMutationResponseGraphQLMapper.toResponseDto,
			).toHaveBeenCalledWith({
				success: true,
				message: 'Plant transplanted successfully',
				id: plantId,
			});
		});
	});
});

