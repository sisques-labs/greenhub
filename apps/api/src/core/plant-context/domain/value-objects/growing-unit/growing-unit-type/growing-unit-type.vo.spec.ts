import { GrowingUnitTypeEnum } from "@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum";
import { GrowingUnitTypeValueObject } from "@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo";
import { InvalidEnumValueException } from "@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception";

describe("GrowingUnitTypeValueObject", () => {
	describe("constructor", () => {
		it("should create a type value object with valid enum value", () => {
			const type = new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.POT);

			expect(type.value).toBe(GrowingUnitTypeEnum.POT);
		});

		it("should create a type value object with all valid enum values", () => {
			const enumValues = [
				GrowingUnitTypeEnum.POT,
				GrowingUnitTypeEnum.GARDEN_BED,
				GrowingUnitTypeEnum.HANGING_BASKET,
				GrowingUnitTypeEnum.WINDOW_BOX,
			];

			enumValues.forEach((enumValue) => {
				const type = new GrowingUnitTypeValueObject(enumValue);
				expect(type.value).toBe(enumValue);
			});
		});

		it("should throw InvalidEnumValueException for invalid enum value", () => {
			expect(
				() =>
					new GrowingUnitTypeValueObject("INVALID_TYPE" as GrowingUnitTypeEnum),
			).toThrow(InvalidEnumValueException);
		});
	});

	describe("value getter", () => {
		it("should return the enum value", () => {
			const type = new GrowingUnitTypeValueObject(
				GrowingUnitTypeEnum.GARDEN_BED,
			);

			expect(type.value).toBe(GrowingUnitTypeEnum.GARDEN_BED);
		});
	});
});
