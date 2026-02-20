import { PlantSpeciesDescriptionValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-description/plant-species-description.vo';

describe('PlantSpeciesDescriptionValueObject', () => {
	describe('constructor', () => {
		it('should create with valid description', () => {
			const vo = new PlantSpeciesDescriptionValueObject(
				'A popular garden vegetable.',
			);

			expect(vo.value).toBe('A popular garden vegetable.');
		});

		it('should create with empty string', () => {
			const vo = new PlantSpeciesDescriptionValueObject('');

			expect(vo.value).toBe('');
		});
	});

	describe('value getter', () => {
		it('should return the description string', () => {
			const vo = new PlantSpeciesDescriptionValueObject('Rich in vitamins.');

			expect(vo.value).toBe('Rich in vitamins.');
		});
	});
});
