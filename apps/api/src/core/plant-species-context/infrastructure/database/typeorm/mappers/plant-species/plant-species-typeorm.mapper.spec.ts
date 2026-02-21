import { PlantSpeciesAggregateBuilder } from '@/core/plant-species-context/domain/builders/plant-species/plant-species-aggregate.builder';
import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { PlantSpeciesGrowthRateEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-growth-rate/plant-species-growth-rate.enum';
import { PlantSpeciesHumidityRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.enum';
import { PlantSpeciesLightRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-light-requirements/plant-species-light-requirements.enum';
import { PlantSpeciesSoilTypeEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-soil-type/plant-species-soil-type.enum';
import { PlantSpeciesWaterRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-water-requirements/plant-species-water-requirements.enum';
import { PlantSpeciesTypeormEntity } from '@/core/plant-species-context/infrastructure/database/typeorm/entities/plant-species-typeorm.entity';
import { PlantSpeciesTypeormMapper } from '@/core/plant-species-context/infrastructure/database/typeorm/mappers/plant-species/plant-species-typeorm.mapper';

describe('PlantSpeciesTypeormMapper', () => {
	let mapper: PlantSpeciesTypeormMapper;
	let mockBuilder: jest.Mocked<PlantSpeciesAggregateBuilder>;

	const speciesId = '123e4567-e89b-12d3-a456-426614174000';
	const contributorId = '223e4567-e89b-12d3-a456-426614174001';
	const now = new Date();

	const buildMockAggregate = () => ({
		id: { value: speciesId },
		toPrimitives: jest.fn().mockReturnValue({
			id: speciesId,
			commonName: 'Tomato',
			scientificName: 'Solanum lycopersicum',
			family: 'Solanaceae',
			description: 'A common garden vegetable',
			category: PlantSpeciesCategoryEnum.VEGETABLE,
			difficulty: PlantSpeciesDifficultyEnum.EASY,
			growthRate: PlantSpeciesGrowthRateEnum.FAST,
			lightRequirements: PlantSpeciesLightRequirementsEnum.FULL_SUN,
			waterRequirements: PlantSpeciesWaterRequirementsEnum.MEDIUM,
			temperatureRange: { min: 15, max: 30 },
			humidityRequirements: PlantSpeciesHumidityRequirementsEnum.MEDIUM,
			soilType: PlantSpeciesSoilTypeEnum.LOAMY,
			phRange: { min: 6.0, max: 7.0 },
			matureSize: { height: 150, width: 50 },
			growthTime: 80,
			tags: ['vegetable', 'summer'],
			isVerified: true,
			contributorId,
			createdAt: now,
			updatedAt: now,
			deletedAt: null,
		}),
	});

	const buildTypeormEntity = (overrides: Partial<PlantSpeciesTypeormEntity> = {}): PlantSpeciesTypeormEntity => {
		const entity = new PlantSpeciesTypeormEntity();
		entity.id = speciesId;
		entity.commonName = 'Tomato';
		entity.scientificName = 'Solanum lycopersicum';
		entity.family = 'Solanaceae';
		entity.description = 'A common garden vegetable';
		entity.category = PlantSpeciesCategoryEnum.VEGETABLE;
		entity.difficulty = PlantSpeciesDifficultyEnum.EASY;
		entity.growthRate = PlantSpeciesGrowthRateEnum.FAST;
		entity.lightRequirements = PlantSpeciesLightRequirementsEnum.FULL_SUN;
		entity.waterRequirements = PlantSpeciesWaterRequirementsEnum.MEDIUM;
		entity.temperatureRange = { min: 15, max: 30 };
		entity.humidityRequirements = PlantSpeciesHumidityRequirementsEnum.MEDIUM;
		entity.soilType = PlantSpeciesSoilTypeEnum.LOAMY;
		entity.phRange = { min: 6.0, max: 7.0 };
		entity.matureSize = { height: 150, width: 50 };
		entity.growthTime = 80;
		entity.tags = ['vegetable', 'summer'];
		entity.isVerified = true;
		entity.contributorId = contributorId;
		entity.createdAt = now;
		entity.updatedAt = now;
		entity.deletedAt = null;
		return Object.assign(entity, overrides);
	};

	beforeEach(() => {
		mockBuilder = {
			reset: jest.fn().mockReturnThis(),
			fromPrimitives: jest.fn().mockReturnThis(),
			build: jest.fn(),
		} as unknown as jest.Mocked<PlantSpeciesAggregateBuilder>;

		mapper = new PlantSpeciesTypeormMapper(mockBuilder);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('toDomainEntity', () => {
		it('should convert TypeORM entity to domain aggregate with all properties', () => {
			const typeormEntity = buildTypeormEntity();
			const mockAggregate = buildMockAggregate();

			mockBuilder.build.mockReturnValue(mockAggregate as any);

			const result = mapper.toDomainEntity(typeormEntity);

			expect(result).toBe(mockAggregate);
			expect(mockBuilder.reset).toHaveBeenCalledTimes(1);
			expect(mockBuilder.fromPrimitives).toHaveBeenCalledWith({
				id: speciesId,
				commonName: 'Tomato',
				scientificName: 'Solanum lycopersicum',
				family: 'Solanaceae',
				description: 'A common garden vegetable',
				category: PlantSpeciesCategoryEnum.VEGETABLE,
				difficulty: PlantSpeciesDifficultyEnum.EASY,
				growthRate: PlantSpeciesGrowthRateEnum.FAST,
				lightRequirements: PlantSpeciesLightRequirementsEnum.FULL_SUN,
				waterRequirements: PlantSpeciesWaterRequirementsEnum.MEDIUM,
				temperatureRange: { min: 15, max: 30 },
				humidityRequirements: PlantSpeciesHumidityRequirementsEnum.MEDIUM,
				soilType: PlantSpeciesSoilTypeEnum.LOAMY,
				phRange: { min: 6.0, max: 7.0 },
				matureSize: { height: 150, width: 50 },
				growthTime: 80,
				tags: ['vegetable', 'summer'],
				isVerified: true,
				contributorId,
				createdAt: now,
				updatedAt: now,
				deletedAt: null,
			});
			expect(mockBuilder.build).toHaveBeenCalledTimes(1);
		});

		it('should use default values for nullable JSONB fields when null', () => {
			const typeormEntity = buildTypeormEntity({
				family: null,
				description: null,
				temperatureRange: null,
				phRange: null,
				matureSize: null,
				growthTime: null,
				tags: null,
				contributorId: null,
			});
			const mockAggregate = buildMockAggregate();

			mockBuilder.build.mockReturnValue(mockAggregate as any);

			mapper.toDomainEntity(typeormEntity);

			expect(mockBuilder.fromPrimitives).toHaveBeenCalledWith(
				expect.objectContaining({
					family: '',
					description: '',
					temperatureRange: { min: 0, max: 0 },
					phRange: { min: 0, max: 0 },
					matureSize: { height: 0, width: 0 },
					growthTime: 0,
					tags: [],
					contributorId: null,
				}),
			);
		});
	});

	describe('toTypeormEntity', () => {
		it('should convert domain aggregate to TypeORM entity with all properties', () => {
			const mockAggregate = buildMockAggregate();

			const result = mapper.toTypeormEntity(mockAggregate as any);

			expect(result).toBeInstanceOf(PlantSpeciesTypeormEntity);
			expect(result.id).toBe(speciesId);
			expect(result.commonName).toBe('Tomato');
			expect(result.scientificName).toBe('Solanum lycopersicum');
			expect(result.family).toBe('Solanaceae');
			expect(result.description).toBe('A common garden vegetable');
			expect(result.category).toBe(PlantSpeciesCategoryEnum.VEGETABLE);
			expect(result.difficulty).toBe(PlantSpeciesDifficultyEnum.EASY);
			expect(result.growthRate).toBe(PlantSpeciesGrowthRateEnum.FAST);
			expect(result.lightRequirements).toBe(
				PlantSpeciesLightRequirementsEnum.FULL_SUN,
			);
			expect(result.waterRequirements).toBe(
				PlantSpeciesWaterRequirementsEnum.MEDIUM,
			);
			expect(result.temperatureRange).toEqual({ min: 15, max: 30 });
			expect(result.humidityRequirements).toBe(
				PlantSpeciesHumidityRequirementsEnum.MEDIUM,
			);
			expect(result.soilType).toBe(PlantSpeciesSoilTypeEnum.LOAMY);
			expect(result.phRange).toEqual({ min: 6.0, max: 7.0 });
			expect(result.matureSize).toEqual({ height: 150, width: 50 });
			expect(result.growthTime).toBe(80);
			expect(result.tags).toEqual(['vegetable', 'summer']);
			expect(result.isVerified).toBe(true);
			expect(result.contributorId).toBe(contributorId);
			expect(mockAggregate.toPrimitives).toHaveBeenCalledTimes(1);
		});

		it('should convert domain aggregate with null optional fields to TypeORM entity', () => {
			const mockAggregate = buildMockAggregate();
			mockAggregate.toPrimitives.mockReturnValue({
				id: speciesId,
				commonName: 'Tomato',
				scientificName: 'Solanum lycopersicum',
				family: 'Solanaceae',
				description: 'A common garden vegetable',
				category: PlantSpeciesCategoryEnum.VEGETABLE,
				difficulty: PlantSpeciesDifficultyEnum.EASY,
				growthRate: PlantSpeciesGrowthRateEnum.FAST,
				lightRequirements: PlantSpeciesLightRequirementsEnum.FULL_SUN,
				waterRequirements: PlantSpeciesWaterRequirementsEnum.MEDIUM,
				temperatureRange: { min: 0, max: 0 },
				humidityRequirements: PlantSpeciesHumidityRequirementsEnum.MEDIUM,
				soilType: PlantSpeciesSoilTypeEnum.LOAMY,
				phRange: { min: 0, max: 0 },
				matureSize: { height: 0, width: 0 },
				growthTime: 0,
				tags: [],
				isVerified: false,
				contributorId: null,
				createdAt: now,
				updatedAt: now,
				deletedAt: null,
			});

			const result = mapper.toTypeormEntity(mockAggregate as any);

			expect(result).toBeInstanceOf(PlantSpeciesTypeormEntity);
			expect(result.contributorId).toBeNull();
			expect(result.isVerified).toBe(false);
			expect(result.tags).toEqual([]);
		});
	});
});
