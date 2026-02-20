import { PlantSpeciesMatureSizeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-mature-size/plant-species-mature-size.vo';

describe('PlantSpeciesMatureSizeValueObject', () => {
	describe('constructor', () => {
		it('should create with valid size', () => {
			const vo = new PlantSpeciesMatureSizeValueObject({
				height: 100,
				width: 50,
			});

			expect(vo.height).toBe(100);
			expect(vo.width).toBe(50);
		});

		it('should throw when height is zero or negative', () => {
			expect(
				() => new PlantSpeciesMatureSizeValueObject({ height: 0, width: 50 }),
			).toThrow();

			expect(
				() => new PlantSpeciesMatureSizeValueObject({ height: -10, width: 50 }),
			).toThrow();
		});

		it('should throw when width is zero or negative', () => {
			expect(
				() => new PlantSpeciesMatureSizeValueObject({ height: 100, width: 0 }),
			).toThrow();

			expect(
				() =>
					new PlantSpeciesMatureSizeValueObject({ height: 100, width: -5 }),
			).toThrow();
		});
	});

	describe('value getter', () => {
		it('should return size as object', () => {
			const vo = new PlantSpeciesMatureSizeValueObject({
				height: 120,
				width: 60,
			});

			expect(vo.value).toEqual({ height: 120, width: 60 });
		});
	});

	describe('equals', () => {
		it('should return true for equal sizes', () => {
			const vo1 = new PlantSpeciesMatureSizeValueObject({
				height: 100,
				width: 50,
			});
			const vo2 = new PlantSpeciesMatureSizeValueObject({
				height: 100,
				width: 50,
			});

			expect(vo1.equals(vo2)).toBe(true);
		});

		it('should return false for different sizes', () => {
			const vo1 = new PlantSpeciesMatureSizeValueObject({
				height: 100,
				width: 50,
			});
			const vo2 = new PlantSpeciesMatureSizeValueObject({
				height: 80,
				width: 40,
			});

			expect(vo1.equals(vo2)).toBe(false);
		});
	});

	describe('toPrimitives', () => {
		it('should return primitive representation', () => {
			const vo = new PlantSpeciesMatureSizeValueObject({
				height: 100,
				width: 50,
			});

			expect(vo.toPrimitives()).toEqual({ height: 100, width: 50 });
		});
	});
});
