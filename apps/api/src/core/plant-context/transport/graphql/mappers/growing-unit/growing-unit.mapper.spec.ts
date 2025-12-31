import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import {
	GrowingUnitResponseDto,
	PaginatedGrowingUnitResultDto,
} from '@/core/plant-context/transport/graphql/dtos/responses/growing-unit/growing-unit.response.dto';
import { GrowingUnitGraphQLMapper } from '@/core/plant-context/transport/graphql/mappers/growing-unit/growing-unit.mapper';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

describe('GrowingUnitGraphQLMapper', () => {
	let mapper: GrowingUnitGraphQLMapper;

	beforeEach(() => {
		mapper = new GrowingUnitGraphQLMapper();
	});

	describe('toResponseDto', () => {
		it('should convert growing unit view model to response DTO with all properties', () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const plantViewModel = new PlantViewModel({
				id: plantId,
				growingUnitId: growingUnitId,
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: null,
				notes: null,
				status: 'PLANTED',
				createdAt,
				updatedAt,
			});

			const viewModel = new GrowingUnitViewModel({
				id: growingUnitId,
				name: 'Garden Bed 1',
				type: 'GARDEN_BED',
				capacity: 10,
				dimensions: {
					length: 2.0,
					width: 1.0,
					height: 0.5,
					unit: 'METER',
				},
				plants: [plantViewModel],
				remainingCapacity: 9,
				numberOfPlants: 1,
				volume: 1.0,
				createdAt,
				updatedAt,
			});

			const result = mapper.toResponseDto(viewModel);

			expect(result).toEqual({
				id: growingUnitId,
				name: 'Garden Bed 1',
				type: 'GARDEN_BED',
				capacity: 10,
				dimensions: {
					length: 2.0,
					width: 1.0,
					height: 0.5,
					unit: 'METER',
				},
				plants: [
					{
						id: plantId,
						growingUnitId: growingUnitId,
						name: 'Basil',
						species: 'Ocimum basilicum',
						plantedDate: null,
						notes: null,
						status: 'PLANTED',
						createdAt,
						updatedAt,
					},
				],
				numberOfPlants: 1,
				remainingCapacity: 9,
				volume: 1.0,
				createdAt,
				updatedAt,
			});
		});

		it('should convert growing unit view model with null dimensions and no plants', () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const viewModel = new GrowingUnitViewModel({
				id: growingUnitId,
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

			const result = mapper.toResponseDto(viewModel);

			expect(result).toEqual({
				id: growingUnitId,
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
			});
		});
	});

	describe('toPaginatedResponseDto', () => {
		it('should convert paginated result to paginated response DTO', () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const viewModel = new GrowingUnitViewModel({
				id: growingUnitId,
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

			const paginatedResult = new PaginatedResult([viewModel], 1, 1, 10);

			const result = mapper.toPaginatedResponseDto(paginatedResult);

			expect(result).toEqual({
				items: [
					{
						id: growingUnitId,
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
			});
		});

		it('should convert empty paginated result', () => {
			const paginatedResult = new PaginatedResult([], 0, 1, 10);

			const result = mapper.toPaginatedResponseDto(paginatedResult);

			expect(result).toEqual({
				items: [],
				total: 0,
				page: 1,
				perPage: 10,
				totalPages: 0,
			});
		});
	});
});

