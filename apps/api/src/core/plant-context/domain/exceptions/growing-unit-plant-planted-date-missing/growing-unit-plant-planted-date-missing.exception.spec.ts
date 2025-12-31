import { PlantPlantedDateMissingException } from "@/core/plant-context/domain/exceptions/growing-unit-plant-planted-date-missing/growing-unit-plant-planted-date-missing.exception";
import { BaseDomainException } from "@/shared/domain/exceptions/base-domain.exception";

describe("PlantPlantedDateMissingException", () => {
	it("should be an instance of BaseDomainException", () => {
		const exception = new PlantPlantedDateMissingException(
			"123e4567-e89b-12d3-a456-426614174000",
		);

		expect(exception).toBeInstanceOf(BaseDomainException);
	});

	it("should create exception with correct message", () => {
		const plantId = "123e4567-e89b-12d3-a456-426614174000";
		const exception = new PlantPlantedDateMissingException(plantId);

		expect(exception.message).toBe(
			`Plant ${plantId} does not have a planted date`,
		);
	});

	it("should create exception with different plant IDs", () => {
		const plantIds = [
			"123e4567-e89b-12d3-a456-426614174000",
			"223e4567-e89b-12d3-a456-426614174000",
			"323e4567-e89b-12d3-a456-426614174000",
		];

		plantIds.forEach((id) => {
			const exception = new PlantPlantedDateMissingException(id);

			expect(exception.message).toBe(
				`Plant ${id} does not have a planted date`,
			);
		});
	});

	it("should be throwable and catchable", () => {
		const plantId = "123e4567-e89b-12d3-a456-426614174000";

		expect(() => {
			throw new PlantPlantedDateMissingException(plantId);
		}).toThrow(PlantPlantedDateMissingException);

		expect(() => {
			throw new PlantPlantedDateMissingException(plantId);
		}).toThrow(`Plant ${plantId} does not have a planted date`);
	});
});
