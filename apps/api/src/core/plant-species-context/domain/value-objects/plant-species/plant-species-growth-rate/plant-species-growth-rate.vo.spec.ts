import { PlantSpeciesGrowthRateEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-growth-rate/plant-species-growth-rate.enum';
import { PlantSpeciesGrowthRateValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-growth-rate/plant-species-growth-rate.vo';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('PlantSpeciesGrowthRateValueObject', () => {
	describe('constructor', () => {
		it('should create with valid enum value', () => {
			const vo = new PlantSpeciesGrowthRateValueObject(
				PlantSpeciesGrowthRateEnum.FAST,
			);

			expect(vo.value).toBe(PlantSpeciesGrowthRateEnum.FAST);
		});

		it('should create with all valid enum values', () => {
			const values = Object.values(PlantSpeciesGrowthRateEnum);

			values.forEach((enumValue) => {
				const vo = new PlantSpeciesGrowthRateValueObject(enumValue);
				expect(vo.value).toBe(enumValue);
			});
		});

		it('should throw for invalid enum value', () => {
			expect(
				() =>
					new PlantSpeciesGrowthRateValueObject(
						'INVALID' as PlantSpeciesGrowthRateEnum,
					),
			).toThrow(InvalidEnumValueException);
		});
	});
});
