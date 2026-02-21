import { Test } from '@nestjs/testing';

import { PlantSpeciesDeletedEventHandler } from '@/core/plant-species-context/infrastructure/event-handlers/plant-species/plant-species-deleted/plant-species-deleted.event-handler';
import { PlantSpeciesDeletedEvent } from '@/core/plant-species-context/application/events/plant-species/plant-species-deleted/plant-species-deleted.event';
import {
	IPlantSpeciesReadRepository,
	PLANT_SPECIES_READ_REPOSITORY_TOKEN,
} from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-read/plant-species-read.repository';
import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { PlantSpeciesGrowthRateEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-growth-rate/plant-species-growth-rate.enum';
import { PlantSpeciesLightRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-light-requirements/plant-species-light-requirements.enum';
import { PlantSpeciesWaterRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-water-requirements/plant-species-water-requirements.enum';
import { PlantSpeciesHumidityRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.enum';
import { PlantSpeciesSoilTypeEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-soil-type/plant-species-soil-type.enum';

describe('PlantSpeciesDeletedEventHandler', () => {
	let handler: PlantSpeciesDeletedEventHandler;
	let mockPlantSpeciesReadRepository: jest.Mocked<IPlantSpeciesReadRepository>;

	beforeEach(async () => {
		mockPlantSpeciesReadRepository = {
			findById: jest.fn(),
			findByCriteria: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<IPlantSpeciesReadRepository>;

		const module = await Test.createTestingModule({
			providers: [
				PlantSpeciesDeletedEventHandler,
				{
					provide: PLANT_SPECIES_READ_REPOSITORY_TOKEN,
					useValue: mockPlantSpeciesReadRepository,
				},
			],
		}).compile();

		handler = module.get<PlantSpeciesDeletedEventHandler>(
			PlantSpeciesDeletedEventHandler,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('handle', () => {
		it('should delete plant species view model when event is handled', async () => {
			const plantSpeciesId = '123e4567-e89b-12d3-a456-426614174000';
			const now = new Date();

			const event = new PlantSpeciesDeletedEvent(
				{
					aggregateRootId: plantSpeciesId,
					aggregateRootType: 'PlantSpeciesAggregate',
					entityId: plantSpeciesId,
					entityType: 'PlantSpeciesAggregate',
					eventType: 'PlantSpeciesDeletedEvent',
				},
				{
					id: plantSpeciesId,
					commonName: 'Tomato',
					scientificName: 'Solanum lycopersicum',
					family: 'Solanaceae',
					description: 'A common garden vegetable.',
					category: PlantSpeciesCategoryEnum.VEGETABLE,
					difficulty: PlantSpeciesDifficultyEnum.EASY,
					growthRate: PlantSpeciesGrowthRateEnum.FAST,
					lightRequirements: PlantSpeciesLightRequirementsEnum.FULL_SUN,
					waterRequirements: PlantSpeciesWaterRequirementsEnum.MEDIUM,
					temperatureRange: { min: 15, max: 30 },
					humidityRequirements: PlantSpeciesHumidityRequirementsEnum.MEDIUM,
					soilType: PlantSpeciesSoilTypeEnum.LOAMY,
					phRange: { min: 6.0, max: 7.0 },
					matureSize: { height: 150, width: 60 },
					growthTime: 90,
					tags: ['edible', 'garden'],
					isVerified: true,
					contributorId: null,
					createdAt: now,
					updatedAt: now,
					deletedAt: now,
				},
			);

			mockPlantSpeciesReadRepository.delete.mockResolvedValue(undefined);

			await handler.handle(event);

			expect(mockPlantSpeciesReadRepository.delete).toHaveBeenCalledWith(plantSpeciesId);
			expect(mockPlantSpeciesReadRepository.delete).toHaveBeenCalledTimes(1);
		});
	});
});
