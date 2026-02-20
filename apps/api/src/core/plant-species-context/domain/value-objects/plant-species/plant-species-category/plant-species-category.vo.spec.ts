import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesCategoryValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-category/plant-species-category.vo';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('PlantSpeciesCategoryValueObject', () => {
	describe('constructor', () => {
		it('should create with valid enum value', () => {
			const vo = new PlantSpeciesCategoryValueObject(
				PlantSpeciesCategoryEnum.VEGETABLE,
			);

			expect(vo.value).toBe(PlantSpeciesCategoryEnum.VEGETABLE);
		});

		it('should create with all valid enum values', () => {
			const values = Object.values(PlantSpeciesCategoryEnum);

			values.forEach((enumValue) => {
				const vo = new PlantSpeciesCategoryValueObject(enumValue);
				expect(vo.value).toBe(enumValue);
			});
		});

		it('should throw for invalid enum value', () => {
			expect(
				() =>
					new PlantSpeciesCategoryValueObject(
						'INVALID' as PlantSpeciesCategoryEnum,
					),
			).toThrow(InvalidEnumValueException);
		});
	});
});
