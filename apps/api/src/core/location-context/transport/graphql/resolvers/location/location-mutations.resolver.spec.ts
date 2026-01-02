import { CommandBus } from '@nestjs/cqrs';

import { LocationCreateCommand } from '@/core/location-context/application/commands/location/location-create/location-create.command';
import { LocationDeleteCommand } from '@/core/location-context/application/commands/location/location-delete/location-delete.command';
import { LocationUpdateCommand } from '@/core/location-context/application/commands/location/location-update/location-update.command';
import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import { LocationCreateRequestDto } from '@/core/location-context/transport/graphql/dtos/requests/location/location-create.request.dto';
import { LocationDeleteRequestDto } from '@/core/location-context/transport/graphql/dtos/requests/location/location-delete.request.dto';
import { LocationUpdateRequestDto } from '@/core/location-context/transport/graphql/dtos/requests/location/location-update.request.dto';
import { LocationMutationsResolver } from '@/core/location-context/transport/graphql/resolvers/location/location-mutations.resolver';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';

describe('LocationMutationsResolver', () => {
	let resolver: LocationMutationsResolver;
	let mockCommandBus: jest.Mocked<CommandBus>;
	let mockMutationResponseGraphQLMapper: jest.Mocked<MutationResponseGraphQLMapper>;

	beforeEach(() => {
		mockCommandBus = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<CommandBus>;

		mockMutationResponseGraphQLMapper = {
			toResponseDto: jest.fn(),
		} as unknown as jest.Mocked<MutationResponseGraphQLMapper>;

		resolver = new LocationMutationsResolver(
			mockCommandBus,
			mockMutationResponseGraphQLMapper,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('createLocation', () => {
		it('should create location successfully', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const input: LocationCreateRequestDto = {
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room with good sunlight',
			};

			const mutationResponse: MutationResponseDto = {
				success: true,
				message: 'Location created successfully',
				id: locationId,
			};

			mockCommandBus.execute.mockResolvedValue(locationId);
			mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
				mutationResponse,
			);

			const result = await resolver.createLocation(input);

			expect(result).toBe(mutationResponse);
			expect(mockCommandBus.execute).toHaveBeenCalledWith(
				expect.any(LocationCreateCommand),
			);
			const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
			expect(command).toBeInstanceOf(LocationCreateCommand);
			expect(command.name.value).toBe('Living Room');
			expect(command.type.value).toBe(LocationTypeEnum.ROOM);
			expect(command.description?.value).toBe(
				'North-facing room with good sunlight',
			);
			expect(
				mockMutationResponseGraphQLMapper.toResponseDto,
			).toHaveBeenCalledWith({
				success: true,
				message: 'Location created successfully',
				id: locationId,
			});
		});

		it('should create location without description', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const input: LocationCreateRequestDto = {
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
			};

			const mutationResponse: MutationResponseDto = {
				success: true,
				message: 'Location created successfully',
				id: locationId,
			};

			mockCommandBus.execute.mockResolvedValue(locationId);
			mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
				mutationResponse,
			);

			const result = await resolver.createLocation(input);

			expect(result).toBe(mutationResponse);
			expect(mockCommandBus.execute).toHaveBeenCalledWith(
				expect.any(LocationCreateCommand),
			);
		});
	});

	describe('updateLocation', () => {
		it('should update location successfully', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const input: LocationUpdateRequestDto = {
				id: locationId,
				name: 'Living Room Updated',
				type: LocationTypeEnum.ROOM,
				description: 'Updated description',
			};

			const mutationResponse: MutationResponseDto = {
				success: true,
				message: 'Location updated successfully',
				id: locationId,
			};

			mockCommandBus.execute.mockResolvedValue(undefined);
			mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
				mutationResponse,
			);

			const result = await resolver.updateLocation(input);

			expect(result).toBe(mutationResponse);
			expect(mockCommandBus.execute).toHaveBeenCalledWith(
				expect.any(LocationUpdateCommand),
			);
			const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
			expect(command).toBeInstanceOf(LocationUpdateCommand);
			expect(command.id.value).toBe(locationId);
			expect(command.name?.value).toBe('Living Room Updated');
			expect(
				mockMutationResponseGraphQLMapper.toResponseDto,
			).toHaveBeenCalledWith({
				success: true,
				message: 'Location updated successfully',
				id: locationId,
			});
		});

		it('should update location with partial fields', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const input: LocationUpdateRequestDto = {
				id: locationId,
				name: 'Living Room Updated',
			};

			const mutationResponse: MutationResponseDto = {
				success: true,
				message: 'Location updated successfully',
				id: locationId,
			};

			mockCommandBus.execute.mockResolvedValue(undefined);
			mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
				mutationResponse,
			);

			const result = await resolver.updateLocation(input);

			expect(result).toBe(mutationResponse);
			expect(mockCommandBus.execute).toHaveBeenCalledWith(
				expect.any(LocationUpdateCommand),
			);
			const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
			expect(command.type).toBeUndefined();
		});
	});

	describe('deleteLocation', () => {
		it('should delete location successfully', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const input: LocationDeleteRequestDto = {
				id: locationId,
			};

			const mutationResponse: MutationResponseDto = {
				success: true,
				message: 'Location deleted successfully',
				id: locationId,
			};

			mockCommandBus.execute.mockResolvedValue(undefined);
			mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
				mutationResponse,
			);

			const result = await resolver.deleteLocation(input);

			expect(result).toBe(mutationResponse);
			expect(mockCommandBus.execute).toHaveBeenCalledWith(
				expect.any(LocationDeleteCommand),
			);
			const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
			expect(command).toBeInstanceOf(LocationDeleteCommand);
			expect(command.id.value).toBe(locationId);
			expect(
				mockMutationResponseGraphQLMapper.toResponseDto,
			).toHaveBeenCalledWith({
				success: true,
				message: 'Location deleted successfully',
				id: locationId,
			});
		});
	});
});

