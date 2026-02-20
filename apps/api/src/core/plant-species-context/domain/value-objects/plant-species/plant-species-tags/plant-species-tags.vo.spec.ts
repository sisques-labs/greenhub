import { PlantSpeciesTagsValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-tags/plant-species-tags.vo';

describe('PlantSpeciesTagsValueObject', () => {
	describe('constructor', () => {
		it('should create with array of tags', () => {
			const vo = new PlantSpeciesTagsValueObject([
				'edible',
				'perennial',
				'drought-resistant',
			]);

			expect(vo.value).toEqual(['edible', 'perennial', 'drought-resistant']);
		});

		it('should create with empty array', () => {
			const vo = new PlantSpeciesTagsValueObject([]);

			expect(vo.value).toEqual([]);
		});
	});

	describe('value getter', () => {
		it('should return a copy of the tags array', () => {
			const tags = ['edible', 'fast-growing'];
			const vo = new PlantSpeciesTagsValueObject(tags);

			const result = vo.value;
			result.push('extra');

			expect(vo.value).toEqual(['edible', 'fast-growing']);
		});
	});

	describe('has', () => {
		it('should return true when tag exists', () => {
			const vo = new PlantSpeciesTagsValueObject(['edible', 'perennial']);

			expect(vo.has('edible')).toBe(true);
		});

		it('should return false when tag does not exist', () => {
			const vo = new PlantSpeciesTagsValueObject(['edible', 'perennial']);

			expect(vo.has('invasive')).toBe(false);
		});
	});

	describe('isEmpty', () => {
		it('should return true for empty tags', () => {
			const vo = new PlantSpeciesTagsValueObject([]);

			expect(vo.isEmpty()).toBe(true);
		});

		it('should return false for non-empty tags', () => {
			const vo = new PlantSpeciesTagsValueObject(['edible']);

			expect(vo.isEmpty()).toBe(false);
		});
	});

	describe('count', () => {
		it('should return the number of tags', () => {
			const vo = new PlantSpeciesTagsValueObject(['a', 'b', 'c']);

			expect(vo.count()).toBe(3);
		});
	});

	describe('equals', () => {
		it('should return true for equal tag sets', () => {
			const vo1 = new PlantSpeciesTagsValueObject(['a', 'b']);
			const vo2 = new PlantSpeciesTagsValueObject(['a', 'b']);

			expect(vo1.equals(vo2)).toBe(true);
		});

		it('should return false for different tag sets', () => {
			const vo1 = new PlantSpeciesTagsValueObject(['a', 'b']);
			const vo2 = new PlantSpeciesTagsValueObject(['a', 'c']);

			expect(vo1.equals(vo2)).toBe(false);
		});

		it('should return false for different lengths', () => {
			const vo1 = new PlantSpeciesTagsValueObject(['a', 'b']);
			const vo2 = new PlantSpeciesTagsValueObject(['a']);

			expect(vo1.equals(vo2)).toBe(false);
		});
	});

	describe('toPrimitives', () => {
		it('should return primitive array', () => {
			const vo = new PlantSpeciesTagsValueObject(['edible', 'herb']);

			expect(vo.toPrimitives()).toEqual(['edible', 'herb']);
		});
	});
});
