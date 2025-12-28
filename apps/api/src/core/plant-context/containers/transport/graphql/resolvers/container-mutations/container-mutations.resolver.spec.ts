import { ContainerCreateCommand } from '@/core/plant-context/containers/application/commands/container-create/container-create.command';
import { ContainerDeleteCommand } from '@/core/plant-context/containers/application/commands/container-delete/container-delete.command';
import { ContainerUpdateCommand } from '@/core/plant-context/containers/application/commands/container-update/container-update.command';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import { CreateContainerRequestDto } from '@/core/plant-context/containers/transport/graphql/dtos/requests/create-container.request.dto';
import { DeleteContainerRequestDto } from '@/core/plant-context/containers/transport/graphql/dtos/requests/delete-container.request.dto';
import { UpdateContainerRequestDto } from '@/core/plant-context/containers/transport/graphql/dtos/requests/update-container.request.dto';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { CommandBus } from '@nestjs/cqrs';
import { ContainerMutationsResolver } from './container-mutations.resolver';

describe('ContainerMutationsResolver', () => {
  let resolver: ContainerMutationsResolver;
  let mockCommandBus: jest.Mocked<CommandBus>;
  let mockMutationResponseGraphQLMapper: jest.Mocked<MutationResponseGraphQLMapper>;

  beforeEach(() => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    mockMutationResponseGraphQLMapper = {
      toResponseDto: jest.fn(),
    } as unknown as jest.Mocked<MutationResponseGraphQLMapper>;

    resolver = new ContainerMutationsResolver(
      mockCommandBus,
      mockMutationResponseGraphQLMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createContainer', () => {
    it('should create container successfully', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const input: CreateContainerRequestDto = {
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Container created successfully',
        id: containerId,
      };

      mockCommandBus.execute.mockResolvedValue(containerId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.createContainer(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(ContainerCreateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(ContainerCreateCommand);
      expect(command.name.value).toBe('Garden Bed 1');
      expect(command.type.value).toBe(ContainerTypeEnum.GARDEN_BED);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Container created successfully',
        id: containerId,
      });
    });

    it('should create container with different types', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const testCases = [
        ContainerTypeEnum.POT,
        ContainerTypeEnum.GARDEN_BED,
        ContainerTypeEnum.HANGING_BASKET,
        ContainerTypeEnum.WINDOW_BOX,
      ];

      for (const type of testCases) {
        const input: CreateContainerRequestDto = {
          name: 'Container',
          type,
        };

        const mutationResponse: MutationResponseDto = {
          success: true,
          message: 'Container created successfully',
          id: containerId,
        };

        mockCommandBus.execute.mockResolvedValue(containerId);
        mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
          mutationResponse,
        );

        const result = await resolver.createContainer(input);

        expect(result).toBe(mutationResponse);
        const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
        expect(command.type.value).toBe(type);

        jest.clearAllMocks();
      }
    });

    it('should handle errors from command bus', async () => {
      const input: CreateContainerRequestDto = {
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
      };

      const error = new Error('Container creation failed');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.createContainer(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(ContainerCreateCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('updateContainer', () => {
    it('should update container successfully', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const input: UpdateContainerRequestDto = {
        id: containerId,
        name: 'Updated Garden Bed 1',
        type: ContainerTypeEnum.POT,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Container updated successfully',
        id: containerId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.updateContainer(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(ContainerUpdateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(ContainerUpdateCommand);
      expect(command.id.value).toBe(containerId);
      expect(command.name?.value).toBe('Updated Garden Bed 1');
      expect(command.type?.value).toBe(ContainerTypeEnum.POT);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Container updated successfully',
        id: containerId,
      });
    });

    it('should update container with partial data', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const input: UpdateContainerRequestDto = {
        id: containerId,
        name: 'Updated Name',
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Container updated successfully',
        id: containerId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.updateContainer(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(ContainerUpdateCommand),
      );
    });

    it('should handle errors from command bus', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const input: UpdateContainerRequestDto = {
        id: containerId,
        name: 'Updated Name',
      };

      const error = new Error('Container not found');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.updateContainer(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(ContainerUpdateCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('deleteContainer', () => {
    it('should delete container successfully', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const input: DeleteContainerRequestDto = {
        id: containerId,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Container deleted successfully',
        id: containerId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.deleteContainer(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(ContainerDeleteCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(ContainerDeleteCommand);
      expect(command.id.value).toBe(containerId);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Container deleted successfully',
        id: containerId,
      });
    });

    it('should handle errors from command bus', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const input: DeleteContainerRequestDto = {
        id: containerId,
      };

      const error = new Error('Container not found');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.deleteContainer(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(ContainerDeleteCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });
});
