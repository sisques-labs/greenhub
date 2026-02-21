import { PlantSpeciesCreateCommand } from '@/core/plant-species-context/application/commands/plant-species/plant-species-create/plant-species-create.command';
import { PlantSpeciesCreateCommandHandler } from '@/core/plant-species-context/application/commands/plant-species/plant-species-create/plant-species-create.command-handler';
import { IPlantSpeciesCreateCommandDto } from '@/core/plant-species-context/application/dtos/commands/plant-species/plant-species-create/plant-species-create-command.dto';
import { PlantSpeciesScientificNameAlreadyInUseException } from '@/core/plant-species-context/application/exceptions/plant-species/plant-species-scientific-name-already-in-use/plant-species-scientific-name-already-in-use.exception';
import { PlantSpeciesCreatedEvent } from '@/core/plant-species-context/application/events/plant-species/plant-species-created/plant-species-created.event';
import { PlantSpeciesAggregate } from '@/core/plant-species-context/domain/aggregates/plant-species/plant-species.aggregate';
import { PlantSpeciesAggregateBuilder } from '@/core/plant-species-context/domain/builders/plant-species/plant-species-aggregate.builder';
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
import { PublishIntegrationEventsService } from '@/shared/application/services/publish-integration-events/publish-integration-events.service';
import { BooleanValueObject } from '@/shared/domain/value-objects/boolean/boolean.vo';
import { PlantSpeciesUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-species-uuid/plant-species-uuid.vo';

function createMockPlantSpecies(id?: string): PlantSpeciesAggregate {
	const speciesId = id ?? '123e4567-e89b-12d3-a456-426614174000';
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

describe('PlantSpeciesCreateCommandHandler', () => {
	let handler: PlantSpeciesCreateCommandHandler;
	let mockPlantSpeciesWriteRepository: jest.Mocked<IPlantSpeciesWriteRepository>;
	let mockPublishIntegrationEventsService: jest.Mocked<PublishIntegrationEventsService>;
	let mockPlantSpeciesAggregateBuilder: jest.Mocked<PlantSpeciesAggregateBuilder>;

	const baseCommandDto: IPlantSpeciesCreateCommandDto = {
		commonName: 'Rose',
		scientificName: 'Rosa canina',
		family: 'Rosaceae',
		description: 'A beautiful rose',
		category: PlantSpeciesCategoryEnum.FLOWER,
		difficulty: PlantSpeciesDifficultyEnum.EASY,
		growthRate: PlantSpeciesGrowthRateEnum.MEDIUM,
		lightRequirements: PlantSpeciesLightRequirementsEnum.FULL_SUN,
		waterRequirements: PlantSpeciesWaterRequirementsEnum.MEDIUM,
		temperatureRange: { min: 10, max: 30 },
		humidityRequirements: PlantSpeciesHumidityRequirementsEnum.MEDIUM,
		soilType: PlantSpeciesSoilTypeEnum.LOAMY,
		phRange: { min: 6.0, max: 7.0 },
		matureSize: { height: 100, width: 80 },
		growthTime: 180,
		tags: ['perennial'],
	};

	beforeEach(() => {
		mockPlantSpeciesWriteRepository = {
			findById: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
			findByScientificName: jest.fn(),
			findByCommonName: jest.fn(),
		} as unknown as jest.Mocked<IPlantSpeciesWriteRepository>;

		mockPublishIntegrationEventsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<PublishIntegrationEventsService>;

		mockPlantSpeciesAggregateBuilder = {
			reset: jest.fn().mockReturnThis(),
			withId: jest.fn().mockReturnThis(),
			withCommonName: jest.fn().mockReturnThis(),
			withScientificName: jest.fn().mockReturnThis(),
			withFamily: jest.fn().mockReturnThis(),
			withDescription: jest.fn().mockReturnThis(),
			withCategory: jest.fn().mockReturnThis(),
			withDifficulty: jest.fn().mockReturnThis(),
			withGrowthRate: jest.fn().mockReturnThis(),
			withLightRequirements: jest.fn().mockReturnThis(),
			withWaterRequirements: jest.fn().mockReturnThis(),
			withTemperatureRange: jest.fn().mockReturnThis(),
			withHumidityRequirements: jest.fn().mockReturnThis(),
			withSoilType: jest.fn().mockReturnThis(),
			withPhRange: jest.fn().mockReturnThis(),
			withMatureSize: jest.fn().mockReturnThis(),
			withGrowthTime: jest.fn().mockReturnThis(),
			withTags: jest.fn().mockReturnThis(),
			withContributorId: jest.fn().mockReturnThis(),
			build: jest.fn(),
		} as unknown as jest.Mocked<PlantSpeciesAggregateBuilder>;

		handler = new PlantSpeciesCreateCommandHandler(
			mockPlantSpeciesWriteRepository,
			mockPlantSpeciesAggregateBuilder,
			mockPublishIntegrationEventsService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should create plant species successfully', async () => {
			const command = new PlantSpeciesCreateCommand(baseCommandDto);
			const mockPlantSpecies = createMockPlantSpecies();

			mockPlantSpeciesWriteRepository.findByScientificName.mockResolvedValue(
				null,
			);
			mockPlantSpeciesAggregateBuilder.build.mockReturnValue(mockPlantSpecies);
			mockPlantSpeciesWriteRepository.save.mockResolvedValue(mockPlantSpecies);
			mockPublishIntegrationEventsService.execute.mockResolvedValue(undefined);

			const result = await handler.execute(command);

			expect(result).toBe(mockPlantSpecies.id.value);
			expect(
				mockPlantSpeciesWriteRepository.findByScientificName,
			).toHaveBeenCalledTimes(1);
			expect(mockPlantSpeciesAggregateBuilder.reset).toHaveBeenCalledTimes(1);
			expect(mockPlantSpeciesAggregateBuilder.build).toHaveBeenCalledTimes(1);
			expect(mockPlantSpeciesWriteRepository.save).toHaveBeenCalledWith(
				mockPlantSpecies,
			);
			expect(mockPublishIntegrationEventsService.execute).toHaveBeenCalledTimes(
				1,
			);
		});

		it('should throw when scientific name already exists', async () => {
			const command = new PlantSpeciesCreateCommand(baseCommandDto);
			const existingPlantSpecies = createMockPlantSpecies();

			mockPlantSpeciesWriteRepository.findByScientificName.mockResolvedValue(
				existingPlantSpecies,
			);

			await expect(handler.execute(command)).rejects.toThrow(
				PlantSpeciesScientificNameAlreadyInUseException,
			);

			expect(mockPlantSpeciesAggregateBuilder.build).not.toHaveBeenCalled();
			expect(mockPlantSpeciesWriteRepository.save).not.toHaveBeenCalled();
			expect(
				mockPublishIntegrationEventsService.execute,
			).not.toHaveBeenCalled();
		});

		it('should publish PlantSpeciesCreatedEvent when plant species is created', async () => {
			const command = new PlantSpeciesCreateCommand(baseCommandDto);
			const mockPlantSpecies = createMockPlantSpecies();

			mockPlantSpeciesWriteRepository.findByScientificName.mockResolvedValue(
				null,
			);
			mockPlantSpeciesAggregateBuilder.build.mockReturnValue(mockPlantSpecies);
			mockPlantSpeciesWriteRepository.save.mockResolvedValue(mockPlantSpecies);
			mockPublishIntegrationEventsService.execute.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockPublishIntegrationEventsService.execute).toHaveBeenCalled();
			const callArgs =
				mockPublishIntegrationEventsService.execute.mock.calls[0][0];
			expect(callArgs).toBeInstanceOf(PlantSpeciesCreatedEvent);
		});

		it('should save plant species before publishing events', async () => {
			const command = new PlantSpeciesCreateCommand(baseCommandDto);
			const mockPlantSpecies = createMockPlantSpecies();

			mockPlantSpeciesWriteRepository.findByScientificName.mockResolvedValue(
				null,
			);
			mockPlantSpeciesAggregateBuilder.build.mockReturnValue(mockPlantSpecies);
			mockPlantSpeciesWriteRepository.save.mockResolvedValue(mockPlantSpecies);
			mockPublishIntegrationEventsService.execute.mockResolvedValue(undefined);

			await handler.execute(command);

			const saveOrder =
				mockPlantSpeciesWriteRepository.save.mock.invocationCallOrder[0];
			const publishOrder =
				mockPublishIntegrationEventsService.execute.mock.invocationCallOrder[0];
			expect(saveOrder).toBeLessThan(publishOrder);
		});

		it('should return the created plant species id', async () => {
			const plantSpeciesId = '123e4567-e89b-12d3-a456-426614174000';
			const command = new PlantSpeciesCreateCommand(baseCommandDto);
			const mockPlantSpecies = createMockPlantSpecies(plantSpeciesId);

			mockPlantSpeciesWriteRepository.findByScientificName.mockResolvedValue(
				null,
			);
			mockPlantSpeciesAggregateBuilder.build.mockReturnValue(mockPlantSpecies);
			mockPlantSpeciesWriteRepository.save.mockResolvedValue(mockPlantSpecies);
			mockPublishIntegrationEventsService.execute.mockResolvedValue(undefined);

			const result = await handler.execute(command);

			expect(result).toBe(plantSpeciesId);
		});

		it('should create plant species without optional fields', async () => {
			const minimalDto: IPlantSpeciesCreateCommandDto = {
				commonName: 'Rose',
				scientificName: 'Rosa canina',
				category: PlantSpeciesCategoryEnum.FLOWER,
				difficulty: PlantSpeciesDifficultyEnum.EASY,
				growthRate: PlantSpeciesGrowthRateEnum.MEDIUM,
				lightRequirements: PlantSpeciesLightRequirementsEnum.FULL_SUN,
				waterRequirements: PlantSpeciesWaterRequirementsEnum.MEDIUM,
			};

			const command = new PlantSpeciesCreateCommand(minimalDto);
			const mockPlantSpecies = createMockPlantSpecies();

			mockPlantSpeciesWriteRepository.findByScientificName.mockResolvedValue(
				null,
			);
			mockPlantSpeciesAggregateBuilder.build.mockReturnValue(mockPlantSpecies);
			mockPlantSpeciesWriteRepository.save.mockResolvedValue(mockPlantSpecies);
			mockPublishIntegrationEventsService.execute.mockResolvedValue(undefined);

			const result = await handler.execute(command);

			expect(result).toBe(mockPlantSpecies.id.value);
			expect(mockPlantSpeciesWriteRepository.save).toHaveBeenCalledTimes(1);
		});
	});
});
