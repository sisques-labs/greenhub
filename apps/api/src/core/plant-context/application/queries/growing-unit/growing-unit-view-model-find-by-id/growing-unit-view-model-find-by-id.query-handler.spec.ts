import { IGrowingUnitViewModelFindByIdQueryDto } from '@/core/plant-context/application/dtos/queries/growing-unit/growing-unit-view-model-find-by-id/growing-unit-view-model-find-by-id.dto';
import { GrowingUnitNotFoundException } from '@/core/plant-context/application/exceptions/growing-unit/growing-unit-not-found/growing-unit-not-found.exception';
import { GrowingUnitViewModelFindByIdQuery } from '@/core/plant-context/application/queries/growing-unit/growing-unit-view-model-find-by-id/growing-unit-view-model-find-by-id.query';
import { GrowingUnitViewModelFindByIdQueryHandler } from '@/core/plant-context/application/queries/growing-unit/growing-unit-view-model-find-by-id/growing-unit-view-model-find-by-id.query-handler';
import { AssertGrowingUnitViewModelExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-view-model-exists/assert-growing-unit-view-model-exists.service';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';

describe('GrowingUnitViewModelFindByIdQueryHandler', () => {
	let handler: GrowingUnitViewModelFindByIdQueryHandler;
	let mockAssertGrowingUnitViewModelExistsService: jest.Mocked<AssertGrowingUnitViewModelExistsService>;

	beforeEach(() => {
		mockAssertGrowingUnitViewModelExistsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertGrowingUnitViewModelExistsService>;

		handler = new GrowingUnitViewModelFindByIdQueryHandler(
			mockAssertGrowingUnitViewModelExistsService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should return growing unit view model when found', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const queryDto: IGrowingUnitViewModelFindByIdQueryDto = {
				id: growingUnitId,
			};

			const query = new GrowingUnitViewModelFindByIdQuery(queryDto);
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

			mockAssertGrowingUnitViewModelExistsService.execute.mockResolvedValue(
				mockViewModel,
			);

			const result = await handler.execute(query);

			expect(result).toBe(mockViewModel);
			expect(
				mockAssertGrowingUnitViewModelExistsService.execute,
			).toHaveBeenCalledWith(growingUnitId);
			expect(
				mockAssertGrowingUnitViewModelExistsService.execute,
			).toHaveBeenCalledTimes(1);
		});

		it('should throw GrowingUnitNotFoundException when growing unit does not exist', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const queryDto: IGrowingUnitViewModelFindByIdQueryDto = {
				id: growingUnitId,
			};

			const query = new GrowingUnitViewModelFindByIdQuery(queryDto);
			const error = new GrowingUnitNotFoundException(growingUnitId);

			mockAssertGrowingUnitViewModelExistsService.execute.mockRejectedValue(
				error,
			);

			await expect(handler.execute(query)).rejects.toThrow(error);
			expect(
				mockAssertGrowingUnitViewModelExistsService.execute,
			).toHaveBeenCalledWith(growingUnitId);
		});
	});
});
