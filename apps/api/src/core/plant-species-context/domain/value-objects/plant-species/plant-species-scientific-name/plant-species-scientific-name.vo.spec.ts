import { PlantSpeciesScientificNameValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-scientific-name/plant-species-scientific-name.vo';

describe('PlantSpeciesScientificNameValueObject', () => {
	describe('constructor', () => {
		it('should create with valid scientific name', () => {
			const vo = new PlantSpeciesScientificNameValueObject(
				'Solanum lycopersicum',
			);

			expect(vo.value).toBe('Solanum lycopersicum');
		});

		it('should create with empty string', () => {
			const vo = new PlantSpeciesScientificNameValueObject('');

			expect(vo.value).toBe('');
		});
	});

	describe('value getter', () => {
		it('should return the scientific name string', () => {
			const vo = new PlantSpeciesScientificNameValueObject('Ocimum basilicum');

			expect(vo.value).toBe('Ocimum basilicum');
		});
	});
});
