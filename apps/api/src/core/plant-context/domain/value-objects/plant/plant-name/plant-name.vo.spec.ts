import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';

describe('PlantNameValueObject', () => {
	describe('constructor', () => {
		it('should create a name value object with valid string', () => {
			const name = new PlantNameValueObject('Basil');

			expect(name.value).toBe('Basil');
		});

		it('should create a name value object with empty string', () => {
			const name = new PlantNameValueObject('');

			expect(name.value).toBe('');
		});

		it('should create a name value object with long string', () => {
			const longName = 'A'.repeat(100);
			const name = new PlantNameValueObject(longName);

			expect(name.value).toBe(longName);
		});
	});

	describe('value getter', () => {
		it('should return the name string', () => {
			const name = new PlantNameValueObject('Basil');

			expect(name.value).toBe('Basil');
		});
	});
});

