import { PlantChangeStatusCommand } from '@/core/plant-context/plants/application/commands/plant-change-status/plant-change-status.command';
import { PlantCreateCommand } from '@/core/plant-context/plants/application/commands/plant-create/plant-create.command';
import { PlantDeleteCommand } from '@/core/plant-context/plants/application/commands/plant-delete/plant-delete.command';
import { PlantUpdateCommand } from '@/core/plant-context/plants/application/commands/plant-update/plant-update.command';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { CreatePlantRequestDto } from '@/core/plant-context/plants/transport/graphql/dtos/requests/create-plant.request.dto';
import { DeletePlantRequestDto } from '@/core/plant-context/plants/transport/graphql/dtos/requests/delete-plant.request.dto';
import { PlantChangeStatusRequestDto } from '@/core/plant-context/plants/transport/graphql/dtos/requests/plant-change-status.request.dto';
import { UpdatePlantRequestDto } from '@/core/plant-context/plants/transport/graphql/dtos/requests/update-plant.request.dto';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { CommandBus } from '@nestjs/cqrs';
import { PlantMutationsResolver } from './plant-mutations.resolver';

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

  describe('createPlant', () => {
    it('should create plant successfully', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const plantedDate = new Date('2024-01-15');
      const input: CreatePlantRequestDto = {
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Plant created successfully',
        id: plantId,
      };

      mockCommandBus.execute.mockResolvedValue(plantId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.createPlant(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(PlantCreateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(PlantCreateCommand);
      expect(command.name.value).toBe('Aloe Vera');
      expect(command.species.value).toBe('Aloe barbadensis');
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Plant created successfully',
        id: plantId,
      });
    });

    it('should create plant with minimal properties', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const input: CreatePlantRequestDto = {
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Basil',
        species: 'Ocimum basilicum',
        status: PlantStatusEnum.PLANTED,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Plant created successfully',
        id: plantId,
      };

      mockCommandBus.execute.mockResolvedValue(plantId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.createPlant(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(PlantCreateCommand),
      );
    });

    it('should handle errors from command bus', async () => {
      const input: CreatePlantRequestDto = {
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: null,
        notes: null,
        status: PlantStatusEnum.PLANTED,
      };

      const error = new Error('Plant creation failed');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.createPlant(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(PlantCreateCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('updatePlant', () => {
    it('should update plant successfully', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const plantedDate = new Date('2024-01-15');
      const input: UpdatePlantRequestDto = {
        id: plantId,
        name: 'Updated Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: plantedDate,
        notes: 'Updated notes',
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

      const result = await resolver.updatePlant(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(PlantUpdateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(PlantUpdateCommand);
      expect(command.id.value).toBe(plantId);
      expect(command.name?.value).toBe('Updated Aloe Vera');
      expect(command.species?.value).toBe('Aloe barbadensis');
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Plant updated successfully',
        id: plantId,
      });
    });

    it('should update plant with partial data', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const input: UpdatePlantRequestDto = {
        id: plantId,
        name: 'Updated Name',
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

      const result = await resolver.updatePlant(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(PlantUpdateCommand),
      );
    });

    it('should handle errors from command bus', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const input: UpdatePlantRequestDto = {
        id: plantId,
        name: 'Updated Name',
      };

      const error = new Error('Plant not found');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.updatePlant(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(PlantUpdateCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('deletePlant', () => {
    it('should delete plant successfully', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const input: DeletePlantRequestDto = {
        id: plantId,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Plant deleted successfully',
        id: plantId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.deletePlant(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(PlantDeleteCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(PlantDeleteCommand);
      expect(command.id.value).toBe(plantId);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Plant deleted successfully',
        id: plantId,
      });
    });

    it('should handle errors from command bus', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const input: DeletePlantRequestDto = {
        id: plantId,
      };

      const error = new Error('Plant not found');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.deletePlant(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(PlantDeleteCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('changePlantStatus', () => {
    it('should change plant status successfully', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const input: PlantChangeStatusRequestDto = {
        id: plantId,
        status: PlantStatusEnum.GROWING,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Plant status changed successfully',
        id: plantId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.changePlantStatus(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(PlantChangeStatusCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(PlantChangeStatusCommand);
      expect(command.id.value).toBe(plantId);
      expect(command.status.value).toBe(PlantStatusEnum.GROWING);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Plant status changed successfully',
        id: plantId,
      });
    });

    it('should change plant status to different statuses', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const testCases = [PlantStatusEnum.HARVESTED, PlantStatusEnum.DEAD];

      for (const status of testCases) {
        const input: PlantChangeStatusRequestDto = {
          id: plantId,
          status,
        };

        const mutationResponse: MutationResponseDto = {
          success: true,
          message: 'Plant status changed successfully',
          id: plantId,
        };

        mockCommandBus.execute.mockResolvedValue(undefined);
        mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
          mutationResponse,
        );

        const result = await resolver.changePlantStatus(input);

        expect(result).toBe(mutationResponse);
        const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
        expect(command.status.value).toBe(status);

        jest.clearAllMocks();
      }
    });

    it('should handle errors from command bus', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const input: PlantChangeStatusRequestDto = {
        id: plantId,
        status: PlantStatusEnum.GROWING,
      };

      const error = new Error('Plant not found');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.changePlantStatus(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(PlantChangeStatusCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });
});
