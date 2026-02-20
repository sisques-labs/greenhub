import { PlantSpeciesPhRangeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-ph-range/plant-species-ph-range.vo';

describe('PlantSpeciesPhRangeValueObject', () => {
	describe('constructor', () => {
		it('should create with valid range', () => {
			const vo = new PlantSpeciesPhRangeValueObject({ min: 6.0, max: 7.0 });

			expect(vo.min).toBe(6.0);
			expect(vo.max).toBe(7.0);
		});

		it('should create with boundary values', () => {
			const vo = new PlantSpeciesPhRangeValueObject({ min: 0, max: 14 });

			expect(vo.min).toBe(0);
			expect(vo.max).toBe(14);
		});

		it('should throw when min is greater than max', () => {
			expect(
				() => new PlantSpeciesPhRangeValueObject({ min: 8, max: 6 }),
			).toThrow();
		});

		it('should throw when value is out of pH range', () => {
			expect(
				() => new PlantSpeciesPhRangeValueObject({ min: -1, max: 7 }),
			).toThrow();

			expect(
				() => new PlantSpeciesPhRangeValueObject({ min: 6, max: 15 }),
			).toThrow();
		});
	});

	describe('value getter', () => {
		it('should return the range as object', () => {
			const vo = new PlantSpeciesPhRangeValueObject({ min: 5.5, max: 7.5 });

			expect(vo.value).toEqual({ min: 5.5, max: 7.5 });
		});
	});

	describe('equals', () => {
		it('should return true for equal ranges', () => {
			const vo1 = new PlantSpeciesPhRangeValueObject({ min: 6.0, max: 7.0 });
			const vo2 = new PlantSpeciesPhRangeValueObject({ min: 6.0, max: 7.0 });

			expect(vo1.equals(vo2)).toBe(true);
		});

		it('should return false for different ranges', () => {
			const vo1 = new PlantSpeciesPhRangeValueObject({ min: 6.0, max: 7.0 });
			const vo2 = new PlantSpeciesPhRangeValueObject({ min: 5.5, max: 7.5 });

			expect(vo1.equals(vo2)).toBe(false);
		});
	});

	describe('toPrimitives', () => {
		it('should return primitive representation', () => {
			const vo = new PlantSpeciesPhRangeValueObject({ min: 6.0, max: 7.0 });

			expect(vo.toPrimitives()).toEqual({ min: 6.0, max: 7.0 });
		});
	});
});
