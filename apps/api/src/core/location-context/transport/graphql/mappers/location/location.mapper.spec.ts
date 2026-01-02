import { LocationViewModel } from '@/core/location-context/domain/view-models/location/location.view-model';
import { LocationGraphQLMapper } from '@/core/location-context/transport/graphql/mappers/location/location.mapper';
import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

describe('LocationGraphQLMapper', () => {
	let mapper: LocationGraphQLMapper;

	beforeEach(() => {
		mapper = new LocationGraphQLMapper();
	});

	describe('toResponseDto', () => {
		it('should convert location view model to response DTO with all properties', () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const viewModel = new LocationViewModel({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room with good sunlight',
				createdAt,
				updatedAt,
			});

			const result = mapper.toResponseDto(viewModel);

			expect(result).toEqual({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room with good sunlight',
				createdAt,
				updatedAt,
			});
		});

		it('should convert location view model with null description', () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const viewModel = new LocationViewModel({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: null,
				createdAt,
				updatedAt,
			});

			const result = mapper.toResponseDto(viewModel);

			expect(result).toEqual({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: null,
				createdAt,
				updatedAt,
			});
		});
	});

	describe('toPaginatedResponseDto', () => {
		it('should convert paginated result to paginated response DTO', () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const viewModel = new LocationViewModel({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room with good sunlight',
				createdAt,
				updatedAt,
			});

			const paginatedResult = new PaginatedResult([viewModel], 1, 1, 10);

			const result = mapper.toPaginatedResponseDto(paginatedResult);

			expect(result).toEqual({
				items: [
					{
						id: locationId,
						name: 'Living Room',
						type: LocationTypeEnum.ROOM,
						description: 'North-facing room with good sunlight',
						createdAt,
						updatedAt,
					},
				],
				total: 1,
				page: 1,
				perPage: 10,
				totalPages: 1,
			});
		});

		it('should convert empty paginated result', () => {
			const paginatedResult = new PaginatedResult<LocationViewModel>(
				[],
				0,
				1,
				10,
			);

			const result = mapper.toPaginatedResponseDto(paginatedResult);

			expect(result).toEqual({
				items: [],
				total: 0,
				page: 1,
				perPage: 10,
				totalPages: 0,
			});
		});

		it('should convert paginated result with multiple locations', () => {
			const locationId1 = '123e4567-e89b-12d3-a456-426614174000';
			const locationId2 = '223e4567-e89b-12d3-a456-426614174001';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const viewModel1 = new LocationViewModel({
				id: locationId1,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room',
				createdAt,
				updatedAt,
			});

			const viewModel2 = new LocationViewModel({
				id: locationId2,
				name: 'Balcony',
				type: LocationTypeEnum.BALCONY,
				description: 'South-facing balcony',
				createdAt,
				updatedAt,
			});

			const paginatedResult = new PaginatedResult(
				[viewModel1, viewModel2],
				2,
				1,
				10,
			);

			const result = mapper.toPaginatedResponseDto(paginatedResult);

			expect(result).toEqual({
				items: [
					{
						id: locationId1,
						name: 'Living Room',
						type: LocationTypeEnum.ROOM,
						description: 'North-facing room',
						createdAt,
						updatedAt,
					},
					{
						id: locationId2,
						name: 'Balcony',
						type: LocationTypeEnum.BALCONY,
						description: 'South-facing balcony',
						createdAt,
						updatedAt,
					},
				],
				total: 2,
				page: 1,
				perPage: 10,
				totalPages: 1,
			});
		});
	});
});

