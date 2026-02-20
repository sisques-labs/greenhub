import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { PlantSpeciesDifficultyValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-difficulty/plant-species-difficulty.vo';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('PlantSpeciesDifficultyValueObject', () => {
	describe('constructor', () => {
		it('should create with valid enum value', () => {
			const vo = new PlantSpeciesDifficultyValueObject(
				PlantSpeciesDifficultyEnum.EASY,
			);

			expect(vo.value).toBe(PlantSpeciesDifficultyEnum.EASY);
		});

		it('should create with all valid enum values', () => {
			const values = Object.values(PlantSpeciesDifficultyEnum);

			values.forEach((enumValue) => {
				const vo = new PlantSpeciesDifficultyValueObject(enumValue);
				expect(vo.value).toBe(enumValue);
			});
		});

		it('should throw for invalid enum value', () => {
			expect(
				() =>
					new PlantSpeciesDifficultyValueObject(
						'INVALID' as PlantSpeciesDifficultyEnum,
					),
			).toThrow(InvalidEnumValueException);
		});
	});
});
