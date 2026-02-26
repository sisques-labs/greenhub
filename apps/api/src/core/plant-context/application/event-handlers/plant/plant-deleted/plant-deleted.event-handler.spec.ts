import { Test } from '@nestjs/testing';

import { PlantDeletedEventHandler } from '@/core/plant-context/application/event-handlers/plant/plant-deleted/plant-deleted.event-handler';
import { PlantDeletedEvent } from '@/core/plant-context/application/events/plant/plant-deleted/plant-deleted.event';
import {
	IPlantReadRepository,
	PLANT_READ_REPOSITORY_TOKEN,
} from '@/core/plant-context/domain/repositories/plant/plant-read/plant-read.repository';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';

describe('PlantDeletedEventHandler', () => {
	let handler: PlantDeletedEventHandler;
	let mockPlantReadRepository: jest.Mocked<IPlantReadRepository>;

	beforeEach(async () => {
		mockPlantReadRepository = {
			findById: jest.fn(),
			findByCriteria: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<IPlantReadRepository>;

		const module = await Test.createTestingModule({
			providers: [
				PlantDeletedEventHandler,
				{
					provide: PLANT_READ_REPOSITORY_TOKEN,
					useValue: mockPlantReadRepository,
				},
			],
		}).compile();

		handler = module.get<PlantDeletedEventHandler>(PlantDeletedEventHandler);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('handle', () => {
		it('should delete plant view model when event is handled', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';

			const event = new PlantDeletedEvent(
				{
					aggregateRootId: growingUnitId,
					aggregateRootType: 'GrowingUnitAggregate',
					entityId: plantId,
					entityType: 'PlantEntity',
					eventType: 'PlantDeletedEvent',
				},
				{
					id: plantId,
					name: 'Basil',
					species: 'Ocimum basilicum',
					plantedDate: null,
					notes: null,
					status: PlantStatusEnum.PLANTED,
				},
			);

			mockPlantReadRepository.delete.mockResolvedValue(undefined);

			await handler.handle(event);

			expect(mockPlantReadRepository.delete).toHaveBeenCalledWith(plantId);
			expect(mockPlantReadRepository.delete).toHaveBeenCalledTimes(1);
		});

		it('should not throw when an error occurs', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';

			const event = new PlantDeletedEvent(
				{
					aggregateRootId: growingUnitId,
					aggregateRootType: 'GrowingUnitAggregate',
					entityId: plantId,
					entityType: 'PlantEntity',
					eventType: 'PlantDeletedEvent',
				},
				{
					id: plantId,
					name: 'Basil',
					species: 'Ocimum basilicum',
					plantedDate: null,
					notes: null,
					status: PlantStatusEnum.PLANTED,
				},
			);

			mockPlantReadRepository.delete.mockRejectedValue(
				new Error('Database error'),
			);

			await expect(handler.handle(event)).resolves.not.toThrow();
		});
	});
});
