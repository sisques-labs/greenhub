import { PlantSpeciesSoilTypeEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-soil-type/plant-species-soil-type.enum';
import { PlantSpeciesSoilTypeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-soil-type/plant-species-soil-type.vo';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('PlantSpeciesSoilTypeValueObject', () => {
	describe('constructor', () => {
		it('should create with valid enum value', () => {
			const vo = new PlantSpeciesSoilTypeValueObject(
				PlantSpeciesSoilTypeEnum.LOAMY,
			);

			expect(vo.value).toBe(PlantSpeciesSoilTypeEnum.LOAMY);
		});

		it('should create with all valid enum values', () => {
			const values = Object.values(PlantSpeciesSoilTypeEnum);

			values.forEach((enumValue) => {
				const vo = new PlantSpeciesSoilTypeValueObject(enumValue);
				expect(vo.value).toBe(enumValue);
			});
		});

		it('should throw for invalid enum value', () => {
			expect(
				() =>
					new PlantSpeciesSoilTypeValueObject(
						'INVALID' as PlantSpeciesSoilTypeEnum,
					),
			).toThrow(InvalidEnumValueException);
		});
	});
});
