import { NumericRangeValueObject } from '@/shared/domain/value-objects/numeric-range/numeric-range.vo';

describe('NumericRangeValueObject', () => {
	describe('constructor', () => {
		it('should create with valid range', () => {
			const vo = new NumericRangeValueObject({ min: 10, max: 20 });

			expect(vo.min).toBe(10);
			expect(vo.max).toBe(20);
		});

		it('should create when min equals max', () => {
			const vo = new NumericRangeValueObject({ min: 5, max: 5 });

			expect(vo.min).toBe(5);
			expect(vo.max).toBe(5);
		});

		it('should create with negative values', () => {
			const vo = new NumericRangeValueObject({ min: -10, max: -5 });

			expect(vo.min).toBe(-10);
			expect(vo.max).toBe(-5);
		});

		it('should throw when min is greater than max', () => {
			expect(() => new NumericRangeValueObject({ min: 20, max: 10 })).toThrow();
		});
	});

	describe('value getter', () => {
		it('should return the range as object', () => {
			const vo = new NumericRangeValueObject({ min: 5, max: 15 });

			expect(vo.value).toEqual({ min: 5, max: 15 });
		});
	});

	describe('equals', () => {
		it('should return true for equal ranges', () => {
			const vo1 = new NumericRangeValueObject({ min: 5, max: 15 });
			const vo2 = new NumericRangeValueObject({ min: 5, max: 15 });

			expect(vo1.equals(vo2)).toBe(true);
		});

		it('should return false for different ranges', () => {
			const vo1 = new NumericRangeValueObject({ min: 5, max: 15 });
			const vo2 = new NumericRangeValueObject({ min: 0, max: 10 });

			expect(vo1.equals(vo2)).toBe(false);
		});
	});

	describe('toPrimitives', () => {
		it('should return primitive representation', () => {
			const vo = new NumericRangeValueObject({ min: 5, max: 15 });

			expect(vo.toPrimitives()).toEqual({ min: 5, max: 15 });
		});
	});
});
