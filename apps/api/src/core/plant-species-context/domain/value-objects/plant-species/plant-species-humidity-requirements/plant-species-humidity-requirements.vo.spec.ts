import { PlantSpeciesHumidityRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.enum';
import { PlantSpeciesHumidityRequirementsValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.vo';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('PlantSpeciesHumidityRequirementsValueObject', () => {
	describe('constructor', () => {
		it('should create with valid enum value', () => {
			const vo = new PlantSpeciesHumidityRequirementsValueObject(
				PlantSpeciesHumidityRequirementsEnum.HIGH,
			);

			expect(vo.value).toBe(PlantSpeciesHumidityRequirementsEnum.HIGH);
		});

		it('should create with all valid enum values', () => {
			const values = Object.values(PlantSpeciesHumidityRequirementsEnum);

			values.forEach((enumValue) => {
				const vo = new PlantSpeciesHumidityRequirementsValueObject(enumValue);
				expect(vo.value).toBe(enumValue);
			});
		});

		it('should throw for invalid enum value', () => {
			expect(
				() =>
					new PlantSpeciesHumidityRequirementsValueObject(
						'INVALID' as PlantSpeciesHumidityRequirementsEnum,
					),
			).toThrow(InvalidEnumValueException);
		});
	});
});
