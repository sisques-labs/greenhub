import { PlantPlantedDateValueObject } from "@/core/plant-context/domain/value-objects/plant/plant-planted-date/plant-planted-date.vo";

describe("PlantPlantedDateValueObject", () => {
	describe("constructor", () => {
		it("should create a planted date value object with valid date", () => {
			const date = new Date("2024-01-15");
			const plantedDate = new PlantPlantedDateValueObject(date);

			expect(plantedDate.value).toEqual(date);
		});

		it("should create a planted date value object with current date", () => {
			const date = new Date();
			const plantedDate = new PlantPlantedDateValueObject(date);

			expect(plantedDate.value).toEqual(date);
		});

		it("should create a planted date value object with past date", () => {
			const date = new Date("2020-01-01");
			const plantedDate = new PlantPlantedDateValueObject(date);

			expect(plantedDate.value).toEqual(date);
		});

		it("should create a planted date value object with future date", () => {
			const date = new Date("2025-12-31");
			const plantedDate = new PlantPlantedDateValueObject(date);

			expect(plantedDate.value).toEqual(date);
		});
	});

	describe("value getter", () => {
		it("should return the date", () => {
			const date = new Date("2024-01-15");
			const plantedDate = new PlantPlantedDateValueObject(date);

			expect(plantedDate.value).toEqual(date);
		});
	});
});
