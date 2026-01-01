import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import { LocationTypeValueObject } from '@/core/location-context/domain/value-objects/location/location-type/location-type.vo';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('LocationTypeValueObject', () => {
	describe('constructor', () => {
		it('should create a type value object with valid enum value', () => {
			const type = new LocationTypeValueObject(LocationTypeEnum.ROOM);

			expect(type.value).toBe(LocationTypeEnum.ROOM);
		});

		it('should create a type value object with all valid enum values', () => {
			const enumValues = [
				LocationTypeEnum.ROOM,
				LocationTypeEnum.BALCONY,
				LocationTypeEnum.GARDEN,
				LocationTypeEnum.GREENHOUSE,
				LocationTypeEnum.OUTDOOR_SPACE,
				LocationTypeEnum.INDOOR_SPACE,
			];

			enumValues.forEach((enumValue) => {
				const type = new LocationTypeValueObject(enumValue);
				expect(type.value).toBe(enumValue);
			});
		});

		it('should throw InvalidEnumValueException for invalid enum value', () => {
			expect(
				() =>
					new LocationTypeValueObject(
						'INVALID_TYPE' as LocationTypeEnum,
					),
			).toThrow(InvalidEnumValueException);
		});
	});

	describe('value getter', () => {
		it('should return the enum value', () => {
			const type = new LocationTypeValueObject(LocationTypeEnum.GARDEN);

			expect(type.value).toBe(LocationTypeEnum.GARDEN);
		});
	});
});

