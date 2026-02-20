import { PlantSpeciesFamilyValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-family/plant-species-family.vo';

describe('PlantSpeciesFamilyValueObject', () => {
	describe('constructor', () => {
		it('should create with valid family name', () => {
			const vo = new PlantSpeciesFamilyValueObject('Solanaceae');

			expect(vo.value).toBe('Solanaceae');
		});

		it('should create with empty string', () => {
			const vo = new PlantSpeciesFamilyValueObject('');

			expect(vo.value).toBe('');
		});
	});

	describe('value getter', () => {
		it('should return the family string', () => {
			const vo = new PlantSpeciesFamilyValueObject('Lamiaceae');

			expect(vo.value).toBe('Lamiaceae');
		});
	});
});
