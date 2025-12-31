import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';

describe('GrowingUnitNameValueObject', () => {
	describe('constructor', () => {
		it('should create a name value object with valid string', () => {
			const name = new GrowingUnitNameValueObject('Garden Bed 1');

			expect(name.value).toBe('Garden Bed 1');
		});

		it('should create a name value object with empty string', () => {
			const name = new GrowingUnitNameValueObject('');

			expect(name.value).toBe('');
		});

		it('should create a name value object with long string', () => {
			const longName = 'A'.repeat(100);
			const name = new GrowingUnitNameValueObject(longName);

			expect(name.value).toBe(longName);
		});
	});

	describe('value getter', () => {
		it('should return the name string', () => {
			const name = new GrowingUnitNameValueObject('Garden Bed 1');

			expect(name.value).toBe('Garden Bed 1');
		});
	});
});

