import { PlantSpeciesCommonNameValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-common-name/plant-species-common-name.vo';

describe('PlantSpeciesCommonNameValueObject', () => {
	describe('constructor', () => {
		it('should create with valid string', () => {
			const vo = new PlantSpeciesCommonNameValueObject('Tomato');

			expect(vo.value).toBe('Tomato');
		});

		it('should create with empty string', () => {
			const vo = new PlantSpeciesCommonNameValueObject('');

			expect(vo.value).toBe('');
		});

		it('should create with long string', () => {
			const longName = 'A'.repeat(100);
			const vo = new PlantSpeciesCommonNameValueObject(longName);

			expect(vo.value).toBe(longName);
		});
	});

	describe('value getter', () => {
		it('should return the string value', () => {
			const vo = new PlantSpeciesCommonNameValueObject('Basil');

			expect(vo.value).toBe('Basil');
		});
	});
});
