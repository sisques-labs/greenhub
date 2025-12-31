import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('PlantStatusValueObject', () => {
	describe('constructor', () => {
		it('should create a status value object with valid enum value', () => {
			const status = new PlantStatusValueObject(PlantStatusEnum.PLANTED);

			expect(status.value).toBe(PlantStatusEnum.PLANTED);
		});

		it('should create a status value object with all valid enum values', () => {
			const enumValues = [
				PlantStatusEnum.PLANTED,
				PlantStatusEnum.GROWING,
				PlantStatusEnum.HARVESTED,
				PlantStatusEnum.DEAD,
				PlantStatusEnum.ARCHIVED,
			];

			enumValues.forEach((enumValue) => {
				const status = new PlantStatusValueObject(enumValue);
				expect(status.value).toBe(enumValue);
			});
		});

		it('should throw InvalidEnumException for invalid enum value', () => {
			expect(
				() => new PlantStatusValueObject('INVALID_STATUS' as PlantStatusEnum),
			).toThrow(InvalidEnumValueException);
		});
	});

	describe('value getter', () => {
		it('should return the enum value', () => {
			const status = new PlantStatusValueObject(PlantStatusEnum.GROWING);

			expect(status.value).toBe(PlantStatusEnum.GROWING);
		});
	});
});
