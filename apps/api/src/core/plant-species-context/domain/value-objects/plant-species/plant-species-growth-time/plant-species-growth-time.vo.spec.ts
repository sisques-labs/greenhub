import { PlantSpeciesGrowthTimeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-growth-time/plant-species-growth-time.vo';

describe('PlantSpeciesGrowthTimeValueObject', () => {
	describe('constructor', () => {
		it('should create with valid number', () => {
			const vo = new PlantSpeciesGrowthTimeValueObject(90);

			expect(vo.value).toBe(90);
		});

		it('should create with string number', () => {
			const vo = new PlantSpeciesGrowthTimeValueObject('60');

			expect(vo.value).toBe(60);
		});

		it('should throw for negative value', () => {
			expect(() => new PlantSpeciesGrowthTimeValueObject(-1)).toThrow();
		});

		it('should throw for zero value', () => {
			expect(() => new PlantSpeciesGrowthTimeValueObject(0)).toThrow();
		});
	});

	describe('value getter', () => {
		it('should return the growth time in days', () => {
			const vo = new PlantSpeciesGrowthTimeValueObject(120);

			expect(vo.value).toBe(120);
		});
	});
});
