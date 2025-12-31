import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';

describe('PlantSpeciesValueObject', () => {
	describe('constructor', () => {
		it('should create a species value object with valid string', () => {
			const species = new PlantSpeciesValueObject('Ocimum basilicum');

			expect(species.value).toBe('Ocimum basilicum');
		});

		it('should create a species value object with empty string', () => {
			const species = new PlantSpeciesValueObject('');

			expect(species.value).toBe('');
		});

		it('should create a species value object with long string', () => {
			const longSpecies = 'A'.repeat(100);
			const species = new PlantSpeciesValueObject(longSpecies);

			expect(species.value).toBe(longSpecies);
		});
	});

	describe('value getter', () => {
		it('should return the species string', () => {
			const species = new PlantSpeciesValueObject('Ocimum basilicum');

			expect(species.value).toBe('Ocimum basilicum');
		});
	});
});
