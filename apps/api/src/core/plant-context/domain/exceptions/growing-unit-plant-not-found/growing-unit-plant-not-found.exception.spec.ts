import { GrowingUnitPlantNotFoundException } from "@/core/plant-context/domain/exceptions/growing-unit-plant-not-found/growing-unit-plant-not-found.exception";
import { BaseDomainException } from "@/shared/domain/exceptions/base-domain.exception";

describe("GrowingUnitPlantNotFoundException", () => {
	it("should be an instance of BaseDomainException", () => {
		const exception = new GrowingUnitPlantNotFoundException(
			"123e4567-e89b-12d3-a456-426614174000",
			"223e4567-e89b-12d3-a456-426614174000",
		);

		expect(exception).toBeInstanceOf(BaseDomainException);
	});

	it("should create exception with correct message", () => {
		const growingUnitId = "123e4567-e89b-12d3-a456-426614174000";
		const plantId = "223e4567-e89b-12d3-a456-426614174000";
		const exception = new GrowingUnitPlantNotFoundException(
			growingUnitId,
			plantId,
		);

		expect(exception.message).toBe(
			`Plant ${plantId} not found in growing unit ${growingUnitId}`,
		);
	});

	it("should create exception with different IDs", () => {
		const testCases = [
			{
				growingUnitId: "123e4567-e89b-12d3-a456-426614174000",
				plantId: "223e4567-e89b-12d3-a456-426614174000",
			},
			{
				growingUnitId: "323e4567-e89b-12d3-a456-426614174000",
				plantId: "423e4567-e89b-12d3-a456-426614174000",
			},
			{
				growingUnitId: "523e4567-e89b-12d3-a456-426614174000",
				plantId: "623e4567-e89b-12d3-a456-426614174000",
			},
		];

		testCases.forEach(({ growingUnitId, plantId }) => {
			const exception = new GrowingUnitPlantNotFoundException(
				growingUnitId,
				plantId,
			);

			expect(exception.message).toBe(
				`Plant ${plantId} not found in growing unit ${growingUnitId}`,
			);
		});
	});

	it("should be throwable and catchable", () => {
		const growingUnitId = "123e4567-e89b-12d3-a456-426614174000";
		const plantId = "223e4567-e89b-12d3-a456-426614174000";

		expect(() => {
			throw new GrowingUnitPlantNotFoundException(growingUnitId, plantId);
		}).toThrow(GrowingUnitPlantNotFoundException);

		expect(() => {
			throw new GrowingUnitPlantNotFoundException(growingUnitId, plantId);
		}).toThrow(`Plant ${plantId} not found in growing unit ${growingUnitId}`);
	});
});
