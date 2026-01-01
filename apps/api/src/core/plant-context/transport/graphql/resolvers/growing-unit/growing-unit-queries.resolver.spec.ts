import { QueryBus } from '@nestjs/cqrs';
import { GrowingUnitFindByCriteriaQuery } from '@/core/plant-context/application/queries/growing-unit/growing-unit-find-by-criteria/growing-unit-find-by-criteria.query';
import { GrowingUnitViewModelFindByIdQuery } from '@/core/plant-context/application/queries/growing-unit/growing-unit-view-model-find-by-id/growing-unit-view-model-find-by-id.query';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { GrowingUnitFindByCriteriaRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/growing-unit/growing-unit-find-by-criteria.request.dto';
import { GrowingUnitFindByIdRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/growing-unit/growing-unit-find-by-id.request.dto';
import {
	GrowingUnitResponseDto,
	PaginatedGrowingUnitResultDto,
} from '@/core/plant-context/transport/graphql/dtos/responses/growing-unit/growing-unit.response.dto';
import { GrowingUnitGraphQLMapper } from '@/core/plant-context/transport/graphql/mappers/growing-unit/growing-unit.mapper';
import { GrowingUnitQueriesResolver } from '@/core/plant-context/transport/graphql/resolvers/growing-unit/growing-unit-queries.resolver';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

describe('GrowingUnitQueriesResolver', () => {
	let resolver: GrowingUnitQueriesResolver;
	let mockQueryBus: jest.Mocked<QueryBus>;
	let mockGrowingUnitGraphQLMapper: jest.Mocked<GrowingUnitGraphQLMapper>;

	beforeEach(() => {
		mockQueryBus = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<QueryBus>;

		mockGrowingUnitGraphQLMapper = {
			toResponseDto: jest.fn(),
			toPaginatedResponseDto: jest.fn(),
		} as unknown as jest.Mocked<GrowingUnitGraphQLMapper>;

		resolver = new GrowingUnitQueriesResolver(
			mockQueryBus,
			mockGrowingUnitGraphQLMapper,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('growingUnitsFindByCriteria', () => {
		it('should return paginated growing units when criteria matches', async () => {
			const input: GrowingUnitFindByCriteriaRequestDto = {
				filters: [],
				sorts: [],
				pagination: { page: 1, perPage: 10 },
			};

			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');
			const viewModels: GrowingUnitViewModel[] = [
				new GrowingUnitViewModel({
					id: '123e4567-e89b-12d3-a456-426614174000',
					name: 'Garden Bed 1',
					type: 'GARDEN_BED',
					capacity: 10,
					dimensions: null,
					plants: [],
					remainingCapacity: 10,
					numberOfPlants: 0,
					volume: 0,
					createdAt,
					updatedAt,
				}),
			];

			const paginatedResult = new PaginatedResult(viewModels, 1, 1, 10);
			const paginatedResponseDto: PaginatedGrowingUnitResultDto = {
				items: [
					{
						id: '123e4567-e89b-12d3-a456-426614174000',
						name: 'Garden Bed 1',
						type: 'GARDEN_BED',
						capacity: 10,
						dimensions: null,
						plants: [],
						numberOfPlants: 0,
						remainingCapacity: 10,
						volume: 0,
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
			mockGrowingUnitGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
				paginatedResponseDto,
			);

			const result = await resolver.growingUnitsFindByCriteria(input);

			expect(result).toBe(paginatedResponseDto);
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.any(GrowingUnitFindByCriteriaQuery),
			);
			const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
			expect(query).toBeInstanceOf(GrowingUnitFindByCriteriaQuery);
			expect(query.criteria).toBeInstanceOf(Criteria);
			expect(
				mockGrowingUnitGraphQLMapper.toPaginatedResponseDto,
			).toHaveBeenCalledWith(paginatedResult);
		});

		it('should return paginated growing units when input is undefined', async () => {
			const viewModels: GrowingUnitViewModel[] = [];
			const paginatedResult = new PaginatedResult(viewModels, 0, 1, 10);
			const paginatedResponseDto: PaginatedGrowingUnitResultDto = {
				items: [],
				total: 0,
				page: 1,
				perPage: 10,
				totalPages: 0,
			};

			mockQueryBus.execute.mockResolvedValue(paginatedResult);
			mockGrowingUnitGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
				paginatedResponseDto,
			);

			const result = await resolver.growingUnitsFindByCriteria(undefined);

			expect(result).toBe(paginatedResponseDto);
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.any(GrowingUnitFindByCriteriaQuery),
			);
			const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
			expect(query).toBeInstanceOf(GrowingUnitFindByCriteriaQuery);
			expect(query.criteria).toBeInstanceOf(Criteria);
			expect(
				mockGrowingUnitGraphQLMapper.toPaginatedResponseDto,
			).toHaveBeenCalledWith(paginatedResult);
		});
	});

	describe('growingUnitFindById', () => {
		it('should return growing unit when found', async () => {
			const input: GrowingUnitFindByIdRequestDto = {
				id: '123e4567-e89b-12d3-a456-426614174000',
			};

			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');
			const viewModel = new GrowingUnitViewModel({
				id: '123e4567-e89b-12d3-a456-426614174000',
				name: 'Garden Bed 1',
				type: 'GARDEN_BED',
				capacity: 10,
				dimensions: null,
				plants: [],
				remainingCapacity: 10,
				numberOfPlants: 0,
				volume: 0,
				createdAt,
				updatedAt,
			});

			const responseDto: GrowingUnitResponseDto = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				name: 'Garden Bed 1',
				type: 'GARDEN_BED',
				capacity: 10,
				dimensions: null,
				plants: [],
				numberOfPlants: 0,
				remainingCapacity: 10,
				volume: 0,
				createdAt,
				updatedAt,
			};

			mockQueryBus.execute.mockResolvedValue(viewModel);
			mockGrowingUnitGraphQLMapper.toResponseDto.mockReturnValue(responseDto);

			const result = await resolver.growingUnitFindById(input);

			expect(result).toBe(responseDto);
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.any(GrowingUnitViewModelFindByIdQuery),
			);
			const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
			expect(query).toBeInstanceOf(GrowingUnitViewModelFindByIdQuery);
			expect(query.id.value).toBe('123e4567-e89b-12d3-a456-426614174000');
			expect(mockGrowingUnitGraphQLMapper.toResponseDto).toHaveBeenCalledWith(
				viewModel,
			);
		});

		it('should return null when growing unit not found', async () => {
			const input: GrowingUnitFindByIdRequestDto = {
				id: '123e4567-e89b-12d3-a456-426614174000',
			};

			mockQueryBus.execute.mockResolvedValue(null);

			const result = await resolver.growingUnitFindById(input);

			expect(result).toBeNull();
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.any(GrowingUnitViewModelFindByIdQuery),
			);
			expect(mockGrowingUnitGraphQLMapper.toResponseDto).not.toHaveBeenCalled();
		});
	});
});

