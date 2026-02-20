import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { PlantSpeciesGrowthRateEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-growth-rate/plant-species-growth-rate.enum';
import { PlantSpeciesHumidityRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.enum';
import { PlantSpeciesLightRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-light-requirements/plant-species-light-requirements.enum';
import { PlantSpeciesSoilTypeEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-soil-type/plant-species-soil-type.enum';
import { PlantSpeciesWaterRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-water-requirements/plant-species-water-requirements.enum';
import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';
import { PlantSpeciesUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-species-uuid/plant-species-uuid.vo';

describe('PlantSpeciesViewModel', () => {
	const now = new Date();
	const createDto = () => ({
		id: new PlantSpeciesUuidValueObject().value,
		commonName: 'Tomato',
		scientificName: 'Solanum lycopersicum',
		family: 'Solanaceae',
		description: 'A popular garden vegetable.',
		category: PlantSpeciesCategoryEnum.VEGETABLE,
		difficulty: PlantSpeciesDifficultyEnum.EASY,
		growthRate: PlantSpeciesGrowthRateEnum.MEDIUM,
		lightRequirements: PlantSpeciesLightRequirementsEnum.FULL_SUN,
		waterRequirements: PlantSpeciesWaterRequirementsEnum.MEDIUM,
		temperatureRange: { min: 15, max: 30 },
		humidityRequirements: PlantSpeciesHumidityRequirementsEnum.MEDIUM,
		soilType: PlantSpeciesSoilTypeEnum.LOAMY,
		phRange: { min: 6.0, max: 7.0 },
		matureSize: { height: 150, width: 60 },
		growthTime: 90,
		tags: ['edible', 'popular'],
		isVerified: false,
		contributorId: null,
		createdAt: now,
		updatedAt: now,
	});

	describe('constructor', () => {
		it('should create a plant species view model with all properties', () => {
			const dto = createDto();
			const vm = new PlantSpeciesViewModel(dto);

			expect(vm.id).toBe(dto.id);
			expect(vm.commonName).toBe('Tomato');
			expect(vm.scientificName).toBe('Solanum lycopersicum');
			expect(vm.family).toBe('Solanaceae');
			expect(vm.category).toBe(PlantSpeciesCategoryEnum.VEGETABLE);
			expect(vm.difficulty).toBe(PlantSpeciesDifficultyEnum.EASY);
			expect(vm.temperatureRange).toEqual({ min: 15, max: 30 });
			expect(vm.phRange).toEqual({ min: 6.0, max: 7.0 });
			expect(vm.matureSize).toEqual({ height: 150, width: 60 });
			expect(vm.growthTime).toBe(90);
			expect(vm.tags).toEqual(['edible', 'popular']);
			expect(vm.isVerified).toBe(false);
			expect(vm.contributorId).toBeNull();
		});
	});

	describe('update', () => {
		it('should update all properties', () => {
			const dto = createDto();
			const vm = new PlantSpeciesViewModel(dto);

			const updateDto = {
				...dto,
				commonName: 'Cherry Tomato',
				difficulty: PlantSpeciesDifficultyEnum.MEDIUM,
				isVerified: true,
			};

			vm.update(updateDto);

			expect(vm.commonName).toBe('Cherry Tomato');
			expect(vm.difficulty).toBe(PlantSpeciesDifficultyEnum.MEDIUM);
			expect(vm.isVerified).toBe(true);
		});

		it('should update the updatedAt timestamp', () => {
			const dto = createDto();
			const vm = new PlantSpeciesViewModel(dto);
			const initialUpdatedAt = vm.updatedAt;

			vm.update({ ...dto, commonName: 'Updated Tomato' });

			expect(vm.updatedAt.getTime()).toBeGreaterThanOrEqual(
				initialUpdatedAt.getTime(),
			);
		});
	});
});
