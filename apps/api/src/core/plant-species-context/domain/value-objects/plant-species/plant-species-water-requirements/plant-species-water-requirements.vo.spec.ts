import { PlantSpeciesWaterRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-water-requirements/plant-species-water-requirements.enum';
import { PlantSpeciesWaterRequirementsValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-water-requirements/plant-species-water-requirements.vo';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('PlantSpeciesWaterRequirementsValueObject', () => {
	describe('constructor', () => {
		it('should create with valid enum value', () => {
			const vo = new PlantSpeciesWaterRequirementsValueObject(
				PlantSpeciesWaterRequirementsEnum.MEDIUM,
			);

			expect(vo.value).toBe(PlantSpeciesWaterRequirementsEnum.MEDIUM);
		});

		it('should create with all valid enum values', () => {
			const values = Object.values(PlantSpeciesWaterRequirementsEnum);

			values.forEach((enumValue) => {
				const vo = new PlantSpeciesWaterRequirementsValueObject(enumValue);
				expect(vo.value).toBe(enumValue);
			});
		});

		it('should throw for invalid enum value', () => {
			expect(
				() =>
					new PlantSpeciesWaterRequirementsValueObject(
						'INVALID' as PlantSpeciesWaterRequirementsEnum,
					),
			).toThrow(InvalidEnumValueException);
		});
	});
});
