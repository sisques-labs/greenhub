import { Test } from '@nestjs/testing';
import { GrowingUnitFindByCriteriaQuery } from '@/core/plant-context/application/queries/growing-unit/growing-unit-find-by-criteria/growing-unit-find-by-criteria.query';
import { GrowingUnitFindByCriteriaQueryHandler } from '@/core/plant-context/application/queries/growing-unit/growing-unit-find-by-criteria/growing-unit-find-by-criteria-by-criteria.query-handler';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import {
	GROWING_UNIT_READ_REPOSITORY_TOKEN,
	IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

describe('GrowingUnitFindByCriteriaQueryHandler', () => {
	let handler: GrowingUnitFindByCriteriaQueryHandler;
	let mockGrowingUnitReadRepository: jest.Mocked<IGrowingUnitReadRepository>;

	beforeEach(async () => {
		mockGrowingUnitReadRepository = {
			findById: jest.fn(),
			findByCriteria: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<IGrowingUnitReadRepository>;

		const module = await Test.createTestingModule({
			providers: [
				GrowingUnitFindByCriteriaQueryHandler,
				{
					provide: GROWING_UNIT_READ_REPOSITORY_TOKEN,
					useValue: mockGrowingUnitReadRepository,
				},
			],
		}).compile();

		handler = module.get<GrowingUnitFindByCriteriaQueryHandler>(
			GrowingUnitFindByCriteriaQueryHandler,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should return paginated result when criteria matches', async () => {
			const criteria = new Criteria();
			const query = new GrowingUnitFindByCriteriaQuery(criteria);
			const now = new Date();
			const mockViewModels = [
				new GrowingUnitViewModel({
					id: '123e4567-e89b-12d3-a456-426614174000',
					name: 'Garden Bed 1',
					type: GrowingUnitTypeEnum.GARDEN_BED,
					capacity: 10,
					dimensions: null,
					plants: [],
					numberOfPlants: 0,
					remainingCapacity: 10,
					volume: 0,
					createdAt: now,
					updatedAt: now,
				}),
				new GrowingUnitViewModel({
					id: '223e4567-e89b-12d3-a456-426614174000',
					name: 'Garden Bed 2',
					type: GrowingUnitTypeEnum.GARDEN_BED,
					capacity: 10,
					dimensions: null,
					plants: [],
					numberOfPlants: 0,
					remainingCapacity: 10,
					volume: 0,
					createdAt: now,
					updatedAt: now,
				}),
			];

			const mockPaginatedResult = new PaginatedResult<GrowingUnitViewModel>(
				mockViewModels,
				2,
				1,
				10,
			);

			mockGrowingUnitReadRepository.findByCriteria.mockResolvedValue(
				mockPaginatedResult,
			);

			const result = await handler.execute(query);

			expect(result).toBe(mockPaginatedResult);
			expect(mockGrowingUnitReadRepository.findByCriteria).toHaveBeenCalledWith(
				criteria,
			);
			expect(
				mockGrowingUnitReadRepository.findByCriteria,
			).toHaveBeenCalledTimes(1);
		});

		it('should return empty paginated result when no matches found', async () => {
			const criteria = new Criteria();
			const query = new GrowingUnitFindByCriteriaQuery(criteria);
			const mockPaginatedResult = new PaginatedResult<GrowingUnitViewModel>(
				[],
				0,
				1,
				10,
			);

			mockGrowingUnitReadRepository.findByCriteria.mockResolvedValue(
				mockPaginatedResult,
			);

			const result = await handler.execute(query);

			expect(result).toBe(mockPaginatedResult);
			expect(result.items).toHaveLength(0);
			expect(result.total).toBe(0);
		});
	});
});

