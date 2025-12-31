import { Test } from '@nestjs/testing';
import { GrowingUnitNotFoundException } from '@/core/plant-context/application/exceptions/growing-unit/growing-unit-not-found/growing-unit-not-found.exception';
import { AssertGrowingUnitViewModelExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-view-model-exists/assert-growing-unit-view-model-exists.service';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import {
	GROWING_UNIT_READ_REPOSITORY_TOKEN,
	IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';

describe('AssertGrowingUnitViewModelExistsService', () => {
	let service: AssertGrowingUnitViewModelExistsService;
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
				AssertGrowingUnitViewModelExistsService,
				{
					provide: GROWING_UNIT_READ_REPOSITORY_TOKEN,
					useValue: mockGrowingUnitReadRepository,
				},
			],
		}).compile();

		service = module.get<AssertGrowingUnitViewModelExistsService>(
			AssertGrowingUnitViewModelExistsService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should return growing unit view model when found', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const now = new Date();
			const mockViewModel = new GrowingUnitViewModel({
				id: growingUnitId,
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
			});

			mockGrowingUnitReadRepository.findById.mockResolvedValue(mockViewModel);

			const result = await service.execute(growingUnitId);

			expect(result).toBe(mockViewModel);
			expect(mockGrowingUnitReadRepository.findById).toHaveBeenCalledWith(
				growingUnitId,
			);
			expect(mockGrowingUnitReadRepository.findById).toHaveBeenCalledTimes(1);
		});

		it('should throw GrowingUnitNotFoundException when growing unit does not exist', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';

			mockGrowingUnitReadRepository.findById.mockResolvedValue(null);

			await expect(service.execute(growingUnitId)).rejects.toThrow(
				GrowingUnitNotFoundException,
			);
			expect(mockGrowingUnitReadRepository.findById).toHaveBeenCalledWith(
				growingUnitId,
			);
		});

		it('should throw exception with correct message', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';

			mockGrowingUnitReadRepository.findById.mockResolvedValue(null);

			await expect(service.execute(growingUnitId)).rejects.toThrow(
				`Growing unit with id ${growingUnitId} not found`,
			);
		});
	});
});
