import { PlantSpeciesUpdateCommand } from '@/core/plant-species-context/application/commands/plant-species/plant-species-update/plant-species-update.command';
import { PlantSpeciesUpdateCommandHandler } from '@/core/plant-species-context/application/commands/plant-species/plant-species-update/plant-species-update.command-handler';
import { IPlantSpeciesUpdateCommandDto } from '@/core/plant-species-context/application/dtos/commands/plant-species/plant-species-update/plant-species-update-command.dto';
import { PlantSpeciesScientificNameAlreadyInUseException } from '@/core/plant-species-context/application/exceptions/plant-species/plant-species-scientific-name-already-in-use/plant-species-scientific-name-already-in-use.exception';
import { PlantSpeciesUpdatedEvent } from '@/core/plant-species-context/application/events/plant-species/plant-species-updated/plant-species-updated.event';
import { AssertPlantSpeciesExistsService } from '@/core/plant-species-context/application/services/plant-species/assert-plant-species-exists/assert-plant-species-exists.service';
import { PlantSpeciesAggregate } from '@/core/plant-species-context/domain/aggregates/plant-species/plant-species.aggregate';
import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { PlantSpeciesGrowthRateEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-growth-rate/plant-species-growth-rate.enum';
import { PlantSpeciesHumidityRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.enum';
import { PlantSpeciesLightRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-light-requirements/plant-species-light-requirements.enum';
import { PlantSpeciesSoilTypeEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-soil-type/plant-species-soil-type.enum';
import { PlantSpeciesWaterRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-water-requirements/plant-species-water-requirements.enum';
import { IPlantSpeciesWriteRepository } from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-write/plant-species-write.repository';
import { PlantSpeciesCategoryValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-category/plant-species-category.vo';
import { PlantSpeciesCommonNameValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-common-name/plant-species-common-name.vo';
import { PlantSpeciesDescriptionValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-description/plant-species-description.vo';
import { PlantSpeciesDifficultyValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-difficulty/plant-species-difficulty.vo';
import { PlantSpeciesFamilyValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-family/plant-species-family.vo';
import { PlantSpeciesGrowthRateValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-growth-rate/plant-species-growth-rate.vo';
import { PlantSpeciesGrowthTimeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-growth-time/plant-species-growth-time.vo';
import { PlantSpeciesHumidityRequirementsValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.vo';
import { PlantSpeciesLightRequirementsValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-light-requirements/plant-species-light-requirements.vo';
import { PlantSpeciesMatureSizeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-mature-size/plant-species-mature-size.vo';
import { PlantSpeciesPhRangeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-ph-range/plant-species-ph-range.vo';
import { PlantSpeciesScientificNameValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-scientific-name/plant-species-scientific-name.vo';
import { PlantSpeciesSoilTypeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-soil-type/plant-species-soil-type.vo';
import { PlantSpeciesTagsValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-tags/plant-species-tags.vo';
import { PlantSpeciesTemperatureRangeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-temperature-range/plant-species-temperature-range.vo';
import { PlantSpeciesWaterRequirementsValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-water-requirements/plant-species-water-requirements.vo';
import { BooleanValueObject } from '@/shared/domain/value-objects/boolean/boolean.vo';
import { PlantSpeciesUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-species-uuid/plant-species-uuid.vo';
import { EventBus } from '@nestjs/cqrs';

const PLANT_SPECIES_ID = '123e4567-e89b-12d3-a456-426614174000';
const OTHER_PLANT_SPECIES_ID = 'aaae4567-e89b-12d3-a456-426614174000';

function createMockPlantSpecies(id?: string): PlantSpeciesAggregate {
	const speciesId = id ?? PLANT_SPECIES_ID;
	return new PlantSpeciesAggregate({
		id: new PlantSpeciesUuidValueObject(speciesId),
		commonName: new PlantSpeciesCommonNameValueObject('Rose'),
		scientificName: new PlantSpeciesScientificNameValueObject('Rosa canina'),
		family: new PlantSpeciesFamilyValueObject('Rosaceae'),
		description: new PlantSpeciesDescriptionValueObject('A beautiful rose'),
		category: new PlantSpeciesCategoryValueObject(
			PlantSpeciesCategoryEnum.FLOWER,
		),
		difficulty: new PlantSpeciesDifficultyValueObject(
			PlantSpeciesDifficultyEnum.EASY,
		),
		growthRate: new PlantSpeciesGrowthRateValueObject(
			PlantSpeciesGrowthRateEnum.MEDIUM,
		),
		lightRequirements: new PlantSpeciesLightRequirementsValueObject(
			PlantSpeciesLightRequirementsEnum.FULL_SUN,
		),
		waterRequirements: new PlantSpeciesWaterRequirementsValueObject(
			PlantSpeciesWaterRequirementsEnum.MEDIUM,
		),
		temperatureRange: new PlantSpeciesTemperatureRangeValueObject({
			min: 10,
			max: 30,
		}),
		humidityRequirements: new PlantSpeciesHumidityRequirementsValueObject(
			PlantSpeciesHumidityRequirementsEnum.MEDIUM,
		),
		soilType: new PlantSpeciesSoilTypeValueObject(PlantSpeciesSoilTypeEnum.LOAMY),
		phRange: new PlantSpeciesPhRangeValueObject({ min: 6.0, max: 7.0 }),
		matureSize: new PlantSpeciesMatureSizeValueObject({
			height: 100,
			width: 80,
		}),
		growthTime: new PlantSpeciesGrowthTimeValueObject(180),
		tags: new PlantSpeciesTagsValueObject(['perennial']),
		isVerified: new BooleanValueObject(false),
		contributorId: null,
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
	});
}

describe('PlantSpeciesUpdateCommandHandler', () => {
	let handler: PlantSpeciesUpdateCommandHandler;
	let mockPlantSpeciesWriteRepository: jest.Mocked<IPlantSpeciesWriteRepository>;
	let mockAssertPlantSpeciesExistsService: jest.Mocked<AssertPlantSpeciesExistsService>;
	let mockEventBus: jest.Mocked<EventBus>;

	beforeEach(() => {
		mockPlantSpeciesWriteRepository = {
			findById: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
			findByScientificName: jest.fn(),
			findByCommonName: jest.fn(),
		} as unknown as jest.Mocked<IPlantSpeciesWriteRepository>;

		mockAssertPlantSpeciesExistsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertPlantSpeciesExistsService>;

		mockEventBus = {
			publish: jest.fn(),
			publishAll: jest.fn(),
		} as unknown as jest.Mocked<EventBus>;

		handler = new PlantSpeciesUpdateCommandHandler(
			mockPlantSpeciesWriteRepository,
			mockAssertPlantSpeciesExistsService,
			mockEventBus,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should update common name successfully', async () => {
			const commandDto: IPlantSpeciesUpdateCommandDto = {
				id: PLANT_SPECIES_ID,
				commonName: 'Wild Rose',
			};

			const command = new PlantSpeciesUpdateCommand(commandDto);
			const mockPlantSpecies = createMockPlantSpecies(PLANT_SPECIES_ID);

			mockAssertPlantSpeciesExistsService.execute.mockResolvedValue(
				mockPlantSpecies,
			);
			mockPlantSpeciesWriteRepository.save.mockResolvedValue(mockPlantSpecies);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockAssertPlantSpeciesExistsService.execute).toHaveBeenCalledWith(
				PLANT_SPECIES_ID,
			);
			expect(mockPlantSpecies.commonName.value).toBe('Wild Rose');
			expect(mockPlantSpeciesWriteRepository.save).toHaveBeenCalledWith(
				mockPlantSpecies,
			);
		});

		it('should update scientific name successfully when unique', async () => {
			const commandDto: IPlantSpeciesUpdateCommandDto = {
				id: PLANT_SPECIES_ID,
				scientificName: 'Rosa gallica',
			};

			const command = new PlantSpeciesUpdateCommand(commandDto);
			const mockPlantSpecies = createMockPlantSpecies(PLANT_SPECIES_ID);

			mockAssertPlantSpeciesExistsService.execute.mockResolvedValue(
				mockPlantSpecies,
			);
			mockPlantSpeciesWriteRepository.findByScientificName.mockResolvedValue(
				null,
			);
			mockPlantSpeciesWriteRepository.save.mockResolvedValue(mockPlantSpecies);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockPlantSpecies.scientificName.value).toBe('Rosa gallica');
			expect(mockPlantSpeciesWriteRepository.save).toHaveBeenCalledWith(
				mockPlantSpecies,
			);
		});

		it('should throw when updating to an already existing scientific name', async () => {
			const commandDto: IPlantSpeciesUpdateCommandDto = {
				id: PLANT_SPECIES_ID,
				scientificName: 'Rosa gallica',
			};

			const command = new PlantSpeciesUpdateCommand(commandDto);
			const mockPlantSpecies = createMockPlantSpecies(PLANT_SPECIES_ID);
			const conflictingPlantSpecies = createMockPlantSpecies(
				OTHER_PLANT_SPECIES_ID,
			);

			mockAssertPlantSpeciesExistsService.execute.mockResolvedValue(
				mockPlantSpecies,
			);
			mockPlantSpeciesWriteRepository.findByScientificName.mockResolvedValue(
				conflictingPlantSpecies,
			);

			await expect(handler.execute(command)).rejects.toThrow(
				PlantSpeciesScientificNameAlreadyInUseException,
			);
			expect(mockPlantSpeciesWriteRepository.save).not.toHaveBeenCalled();
		});

		it('should allow updating scientific name to same value on same entity', async () => {
			const commandDto: IPlantSpeciesUpdateCommandDto = {
				id: PLANT_SPECIES_ID,
				scientificName: 'Rosa canina',
			};

			const command = new PlantSpeciesUpdateCommand(commandDto);
			const mockPlantSpecies = createMockPlantSpecies(PLANT_SPECIES_ID);
			const sameEntityWithSameName = createMockPlantSpecies(PLANT_SPECIES_ID);

			mockAssertPlantSpeciesExistsService.execute.mockResolvedValue(
				mockPlantSpecies,
			);
			mockPlantSpeciesWriteRepository.findByScientificName.mockResolvedValue(
				sameEntityWithSameName,
			);
			mockPlantSpeciesWriteRepository.save.mockResolvedValue(mockPlantSpecies);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockPlantSpeciesWriteRepository.save).toHaveBeenCalledWith(
				mockPlantSpecies,
			);
		});

		it('should update multiple fields at once', async () => {
			const commandDto: IPlantSpeciesUpdateCommandDto = {
				id: PLANT_SPECIES_ID,
				commonName: 'Wild Rose Updated',
				family: 'Rosaceae Updated',
				difficulty: PlantSpeciesDifficultyEnum.MEDIUM,
			};

			const command = new PlantSpeciesUpdateCommand(commandDto);
			const mockPlantSpecies = createMockPlantSpecies(PLANT_SPECIES_ID);

			mockAssertPlantSpeciesExistsService.execute.mockResolvedValue(
				mockPlantSpecies,
			);
			mockPlantSpeciesWriteRepository.save.mockResolvedValue(mockPlantSpecies);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockPlantSpecies.commonName.value).toBe('Wild Rose Updated');
			expect(mockPlantSpecies.family.value).toBe('Rosaceae Updated');
			expect(mockPlantSpecies.difficulty.value).toBe(
				PlantSpeciesDifficultyEnum.MEDIUM,
			);
		});

		it('should publish PlantSpeciesUpdatedEvent via event bus when plant species is updated', async () => {
			const commandDto: IPlantSpeciesUpdateCommandDto = {
				id: PLANT_SPECIES_ID,
				commonName: 'Wild Rose',
			};

			const command = new PlantSpeciesUpdateCommand(commandDto);
			const mockPlantSpecies = createMockPlantSpecies(PLANT_SPECIES_ID);

			mockAssertPlantSpeciesExistsService.execute.mockResolvedValue(
				mockPlantSpecies,
			);
			mockPlantSpeciesWriteRepository.save.mockImplementation(
				async (aggregate) => aggregate,
			);

			let capturedEvents: unknown[] = [];
			mockEventBus.publishAll.mockImplementation(async (events) => {
				capturedEvents = Array.isArray(events)
					? [...events]
					: [...(events as Iterable<unknown>)];
				return undefined;
			});

			await handler.execute(command);

			expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
			expect(capturedEvents.length).toBeGreaterThanOrEqual(1);
			expect(
				capturedEvents.some(
					(e: unknown) =>
						(e as { eventType?: string }).eventType ===
						PlantSpeciesUpdatedEvent.name,
				),
			).toBe(true);
		});

		it('should throw exception when plant species does not exist', async () => {
			const commandDto: IPlantSpeciesUpdateCommandDto = {
				id: PLANT_SPECIES_ID,
				commonName: 'Wild Rose',
			};

			const command = new PlantSpeciesUpdateCommand(commandDto);
			const error = new Error('Plant species not found');

			mockAssertPlantSpeciesExistsService.execute.mockRejectedValue(error);

			await expect(handler.execute(command)).rejects.toThrow(error);
			expect(mockPlantSpeciesWriteRepository.save).not.toHaveBeenCalled();
		});
	});
});
