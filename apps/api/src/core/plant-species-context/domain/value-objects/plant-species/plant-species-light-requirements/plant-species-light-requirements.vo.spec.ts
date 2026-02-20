import { PlantSpeciesLightRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-light-requirements/plant-species-light-requirements.enum';
import { PlantSpeciesLightRequirementsValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-light-requirements/plant-species-light-requirements.vo';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('PlantSpeciesLightRequirementsValueObject', () => {
	describe('constructor', () => {
		it('should create with valid enum value', () => {
			const vo = new PlantSpeciesLightRequirementsValueObject(
				PlantSpeciesLightRequirementsEnum.FULL_SUN,
			);

			expect(vo.value).toBe(PlantSpeciesLightRequirementsEnum.FULL_SUN);
		});

		it('should create with all valid enum values', () => {
			const values = Object.values(PlantSpeciesLightRequirementsEnum);

			values.forEach((enumValue) => {
				const vo = new PlantSpeciesLightRequirementsValueObject(enumValue);
				expect(vo.value).toBe(enumValue);
			});
		});

		it('should throw for invalid enum value', () => {
			expect(
				() =>
					new PlantSpeciesLightRequirementsValueObject(
						'INVALID' as PlantSpeciesLightRequirementsEnum,
					),
			).toThrow(InvalidEnumValueException);
		});
	});
});
