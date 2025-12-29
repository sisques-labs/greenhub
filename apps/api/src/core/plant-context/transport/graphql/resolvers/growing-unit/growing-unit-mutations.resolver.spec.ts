import { GrowingUnitCreateCommand } from '@/core/plant-context/application/commands/growing-unit/growing-unit-create/growing-unit-create.command';
import { GrowingUnitDeleteCommand } from '@/core/plant-context/application/commands/growing-unit/growing-unit-delete/growing-unit-delete.command';
import { GrowingUnitUpdateCommand } from '@/core/plant-context/application/commands/growing-unit/growing-unit-update/growing-unit-update.command';
import { PlantAddCommand } from '@/core/plant-context/application/commands/plant/plant-add/plant-add.command';
import { PlantRemoveCommand } from '@/core/plant-context/application/commands/plant/plant-remove/plant-remove.command';
import { PlantUpdateCommand } from '@/core/plant-context/application/commands/plant/plant-update/plant-update.command';
import { GrowingUnitCreateRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/growing-unit/growing-unit-create.request.dto';
import { GrowingUnitDeleteRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/growing-unit/growing-unit-delete.request.dto';
import { GrowingUnitUpdateRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/growing-unit/growing-unit-update.request.dto';
import { PlantAddRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/plant/plant-add.request.dto';
import { PlantRemoveRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/plant/plant-remove.request.dto';
import { PlantUpdateRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/plant/plant-update.request.dto';
import { GrowingUnitMutationsResolver } from '@/core/plant-context/transport/graphql/resolvers/growing-unit/growing-unit-mutations.resolver';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { LengthUnitEnum } from '@/shared/domain/enums/length-unit/length-unit.enum';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { CommandBus } from '@nestjs/cqrs';

describe('GrowingUnitMutationsResolver', () => {
  let resolver: GrowingUnitMutationsResolver;
  let mockCommandBus: jest.Mocked<CommandBus>;
  let mockMutationResponseGraphQLMapper: jest.Mocked<MutationResponseGraphQLMapper>;

  beforeEach(() => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    mockMutationResponseGraphQLMapper = {
      toResponseDto: jest.fn(),
    } as unknown as jest.Mocked<MutationResponseGraphQLMapper>;

    resolver = new GrowingUnitMutationsResolver(
      mockCommandBus,
      mockMutationResponseGraphQLMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('growingUnitCreate', () => {
    it('should create growing unit successfully', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const input: GrowingUnitCreateRequestDto = {
        name: 'Garden Bed 1',
        type: GrowingUnitTypeEnum.GARDEN_BED,
        capacity: 10,
        length: 2.0,
        width: 1.0,
        height: 0.5,
        unit: LengthUnitEnum.METER,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Growing unit created successfully',
        id: growingUnitId,
      };

      mockCommandBus.execute.mockResolvedValue(growingUnitId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.growingUnitCreate(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(GrowingUnitCreateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(GrowingUnitCreateCommand);
      expect(command.name.value).toBe('Garden Bed 1');
      expect(command.type.value).toBe(GrowingUnitTypeEnum.GARDEN_BED);
      expect(command.capacity.value).toBe(10);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Growing unit created successfully',
        id: growingUnitId,
      });
    });

    it('should create growing unit without dimensions', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const input: GrowingUnitCreateRequestDto = {
        name: 'Garden Bed 1',
        type: GrowingUnitTypeEnum.GARDEN_BED,
        capacity: 10,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Growing unit created successfully',
        id: growingUnitId,
      };

      mockCommandBus.execute.mockResolvedValue(growingUnitId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.growingUnitCreate(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(GrowingUnitCreateCommand),
      );
    });
  });

  describe('growingUnitUpdate', () => {
    it('should update growing unit successfully', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const input: GrowingUnitUpdateRequestDto = {
        id: growingUnitId,
        name: 'Garden Bed 2',
        type: GrowingUnitTypeEnum.GARDEN_BED,
        capacity: 15,
        length: 3.0,
        width: 2.0,
        height: 1.0,
        unit: LengthUnitEnum.METER,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Growing unit updated successfully',
        id: growingUnitId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.growingUnitUpdate(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(GrowingUnitUpdateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(GrowingUnitUpdateCommand);
      expect(command.id.value).toBe(growingUnitId);
      expect(command.name?.value).toBe('Garden Bed 2');
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Growing unit updated successfully',
        id: growingUnitId,
      });
    });

    it('should update growing unit without dimensions', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const input: GrowingUnitUpdateRequestDto = {
        id: growingUnitId,
        name: 'Garden Bed 2',
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Growing unit updated successfully',
        id: growingUnitId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.growingUnitUpdate(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(GrowingUnitUpdateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.dimensions).toBeUndefined();
    });
  });

  describe('growingUnitDelete', () => {
    it('should delete growing unit successfully', async () => {
      const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
      const input: GrowingUnitDeleteRequestDto = {
        id: growingUnitId,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Growing unit deleted successfully',
        id: growingUnitId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.growingUnitDelete(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(GrowingUnitDeleteCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(GrowingUnitDeleteCommand);
      expect(command.id.value).toBe(growingUnitId);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Growing unit deleted successfully',
        id: growingUnitId,
      });
    });
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
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Plant added successfully',
        id: plantId,
      });
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
});
