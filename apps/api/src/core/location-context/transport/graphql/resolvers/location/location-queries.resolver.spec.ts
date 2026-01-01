import { QueryBus } from '@nestjs/cqrs';

import { LocationFindByCriteriaQuery } from '@/core/location-context/application/queries/location/location-find-by-criteria/location-find-by-criteria.query';
import { LocationViewModelFindByIdQuery } from '@/core/location-context/application/queries/location/location-view-model-find-by-id/location-view-model-find-by-id.query';
import { LocationViewModel } from '@/core/location-context/domain/view-models/location/location.view-model';
import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import { LocationFindByCriteriaRequestDto } from '@/core/location-context/transport/graphql/dtos/requests/location/location-find-by-criteria.request.dto';
import { LocationFindByIdRequestDto } from '@/core/location-context/transport/graphql/dtos/requests/location/location-find-by-id.request.dto';
import {
	LocationResponseDto,
	PaginatedLocationResultDto,
} from '@/core/location-context/transport/graphql/dtos/responses/location/location.response.dto';
import { LocationGraphQLMapper } from '@/core/location-context/transport/graphql/mappers/location/location.mapper';
import { LocationQueriesResolver } from '@/core/location-context/transport/graphql/resolvers/location/location-queries.resolver';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

describe('LocationQueriesResolver', () => {
	let resolver: LocationQueriesResolver;
	let mockQueryBus: jest.Mocked<QueryBus>;
	let mockLocationGraphQLMapper: jest.Mocked<LocationGraphQLMapper>;

	beforeEach(() => {
		mockQueryBus = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<QueryBus>;

		mockLocationGraphQLMapper = {
			toResponseDto: jest.fn(),
			toPaginatedResponseDto: jest.fn(),
		} as unknown as jest.Mocked<LocationGraphQLMapper>;

		resolver = new LocationQueriesResolver(
			mockQueryBus,
			mockLocationGraphQLMapper,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('locationsFindByCriteria', () => {
		it('should return paginated locations when criteria matches', async () => {
			const input: LocationFindByCriteriaRequestDto = {
				filters: [],
				sorts: [],
				pagination: { page: 1, perPage: 10 },
			};

			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');
			const viewModels: LocationViewModel[] = [
				new LocationViewModel({
					id: '123e4567-e89b-12d3-a456-426614174000',
					name: 'Living Room',
					type: LocationTypeEnum.ROOM,
					description: 'North-facing room',
					createdAt,
					updatedAt,
				}),
			];

			const paginatedResult = new PaginatedResult(viewModels, 1, 1, 10);
			const paginatedResponseDto: PaginatedLocationResultDto = {
				items: [
					{
						id: '123e4567-e89b-12d3-a456-426614174000',
						name: 'Living Room',
						type: LocationTypeEnum.ROOM,
						description: 'North-facing room',
						createdAt,
						updatedAt,
					},
				],
				total: 1,
				page: 1,
				perPage: 10,
				totalPages: 1,
			};

			mockQueryBus.execute.mockResolvedValue(paginatedResult);
			mockLocationGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
				paginatedResponseDto,
			);

			const result = await resolver.locationsFindByCriteria(input);

			expect(result).toBe(paginatedResponseDto);
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.any(LocationFindByCriteriaQuery),
			);
			const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
			expect(query).toBeInstanceOf(LocationFindByCriteriaQuery);
			expect(query.criteria).toBeInstanceOf(Criteria);
			expect(
				mockLocationGraphQLMapper.toPaginatedResponseDto,
			).toHaveBeenCalledWith(paginatedResult);
		});

		it('should return paginated locations when input is undefined', async () => {
			const viewModels: LocationViewModel[] = [];
			const paginatedResult = new PaginatedResult(viewModels, 0, 1, 10);
			const paginatedResponseDto: PaginatedLocationResultDto = {
				items: [],
				total: 0,
				page: 1,
				perPage: 10,
				totalPages: 0,
			};

			mockQueryBus.execute.mockResolvedValue(paginatedResult);
			mockLocationGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
				paginatedResponseDto,
			);

			const result = await resolver.locationsFindByCriteria(undefined);

			expect(result).toBe(paginatedResponseDto);
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.any(LocationFindByCriteriaQuery),
			);
			const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
			expect(query).toBeInstanceOf(LocationFindByCriteriaQuery);
			expect(query.criteria).toBeInstanceOf(Criteria);
			expect(
				mockLocationGraphQLMapper.toPaginatedResponseDto,
			).toHaveBeenCalledWith(paginatedResult);
		});
	});

	describe('locationFindById', () => {
		it('should return location when found', async () => {
			const input: LocationFindByIdRequestDto = {
				id: '123e4567-e89b-12d3-a456-426614174000',
			};

			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');
			const viewModel = new LocationViewModel({
				id: '123e4567-e89b-12d3-a456-426614174000',
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room with good sunlight',
				createdAt,
				updatedAt,
			});

			const responseDto: LocationResponseDto = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room with good sunlight',
				createdAt,
				updatedAt,
			};

			mockQueryBus.execute.mockResolvedValue(viewModel);
			mockLocationGraphQLMapper.toResponseDto.mockReturnValue(responseDto);

			const result = await resolver.locationFindById(input);

			expect(result).toBe(responseDto);
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.any(LocationViewModelFindByIdQuery),
			);
			const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
			expect(query).toBeInstanceOf(LocationViewModelFindByIdQuery);
			expect(query.id.value).toBe('123e4567-e89b-12d3-a456-426614174000');
			expect(mockLocationGraphQLMapper.toResponseDto).toHaveBeenCalledWith(
				viewModel,
			);
		});

		it('should return null when location not found', async () => {
			const input: LocationFindByIdRequestDto = {
				id: '123e4567-e89b-12d3-a456-426614174000',
			};

			mockQueryBus.execute.mockResolvedValue(null);

			const result = await resolver.locationFindById(input);

			expect(result).toBeNull();
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.any(LocationViewModelFindByIdQuery),
			);
			expect(mockLocationGraphQLMapper.toResponseDto).not.toHaveBeenCalled();
		});
	});
});

