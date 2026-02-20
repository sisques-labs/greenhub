import { PlantSpeciesTemperatureRangeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-temperature-range/plant-species-temperature-range.vo';

describe('PlantSpeciesTemperatureRangeValueObject', () => {
	describe('constructor', () => {
		it('should create with valid range', () => {
			const vo = new PlantSpeciesTemperatureRangeValueObject({
				min: 10,
				max: 35,
			});

			expect(vo.min).toBe(10);
			expect(vo.max).toBe(35);
		});

		it('should create with negative min temperature', () => {
			const vo = new PlantSpeciesTemperatureRangeValueObject({
				min: -10,
				max: 20,
			});

			expect(vo.min).toBe(-10);
			expect(vo.max).toBe(20);
		});

		it('should create when min equals max', () => {
			const vo = new PlantSpeciesTemperatureRangeValueObject({
				min: 20,
				max: 20,
			});

			expect(vo.min).toBe(20);
			expect(vo.max).toBe(20);
		});

		it('should throw when min is greater than max', () => {
			expect(
				() =>
					new PlantSpeciesTemperatureRangeValueObject({ min: 30, max: 10 }),
			).toThrow();
		});
	});

	describe('value getter', () => {
		it('should return the range as object', () => {
			const vo = new PlantSpeciesTemperatureRangeValueObject({
				min: 15,
				max: 30,
			});

			expect(vo.value).toEqual({ min: 15, max: 30 });
		});
	});

	describe('equals', () => {
		it('should return true for equal ranges', () => {
			const vo1 = new PlantSpeciesTemperatureRangeValueObject({
				min: 10,
				max: 35,
			});
			const vo2 = new PlantSpeciesTemperatureRangeValueObject({
				min: 10,
				max: 35,
			});

			expect(vo1.equals(vo2)).toBe(true);
		});

		it('should return false for different ranges', () => {
			const vo1 = new PlantSpeciesTemperatureRangeValueObject({
				min: 10,
				max: 35,
			});
			const vo2 = new PlantSpeciesTemperatureRangeValueObject({
				min: 5,
				max: 30,
			});

			expect(vo1.equals(vo2)).toBe(false);
		});
	});

	describe('toPrimitives', () => {
		it('should return primitive representation', () => {
			const vo = new PlantSpeciesTemperatureRangeValueObject({
				min: 10,
				max: 35,
			});

			expect(vo.toPrimitives()).toEqual({ min: 10, max: 35 });
		});
	});
});
