import { LocationAggregate } from "@/core/location-context/domain/aggregates/location.aggregate";
import type { ILocationDto } from "@/core/location-context/domain/dtos/entities/location/location.dto";
import { LocationTypeEnum } from "@/core/location-context/domain/enums/location-type/location-type.enum";
import { LocationAggregateFactory } from "@/core/location-context/domain/factories/aggregates/location-aggregate/location-aggregate.factory";
import { LocationPrimitives } from "@/core/location-context/domain/primitives/location.primitives";
import { LocationDescriptionValueObject } from "@/core/location-context/domain/value-objects/location/location-description/location-description.vo";
import { LocationNameValueObject } from "@/core/location-context/domain/value-objects/location/location-name/location-name.vo";
import { LocationTypeValueObject } from "@/core/location-context/domain/value-objects/location/location-type/location-type.vo";
import { LocationUuidValueObject } from "@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo";

describe("LocationAggregateFactory", () => {
	let factory: LocationAggregateFactory;

	beforeEach(() => {
		factory = new LocationAggregateFactory();
	});

	describe("create", () => {
		it("should create a LocationAggregate from DTO", () => {
			const dto: ILocationDto = {
				id: new LocationUuidValueObject(),
				name: new LocationNameValueObject("Living Room"),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: new LocationDescriptionValueObject(
					"North-facing room with good sunlight",
				),
			};

			const aggregate = factory.create(dto);

			expect(aggregate).toBeInstanceOf(LocationAggregate);
			expect(aggregate.id.value).toBe(dto.id.value);
			expect(aggregate.name.value).toBe("Living Room");
			expect(aggregate.type.value).toBe(LocationTypeEnum.ROOM);
			expect(aggregate.description?.value).toBe(
				"North-facing room with good sunlight",
			);
		});

		it("should create a LocationAggregate from DTO without description", () => {
			const dto: ILocationDto = {
				id: new LocationUuidValueObject(),
				name: new LocationNameValueObject("Living Room"),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: null,
			};

			const aggregate = factory.create(dto);

			expect(aggregate).toBeInstanceOf(LocationAggregate);
			expect(aggregate.description).toBeNull();
		});

		it("should create aggregate without events by default", () => {
			const dto: ILocationDto = {
				id: new LocationUuidValueObject(),
				name: new LocationNameValueObject("Living Room"),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: null,
			};

			const aggregate = factory.create(dto);

			const events = aggregate.getUncommittedEvents();
			expect(events.length).toBe(0);
		});
	});

	describe("fromPrimitives", () => {
		it("should create a LocationAggregate from primitives", () => {
			const primitives: LocationPrimitives = {
				id: "123e4567-e89b-12d3-a456-426614174000",
				name: "Living Room",
				type: LocationTypeEnum.ROOM,
				description: "North-facing room with good sunlight",
			};

			const aggregate = factory.fromPrimitives(primitives);

			expect(aggregate).toBeInstanceOf(LocationAggregate);
			expect(aggregate.id.value).toBe(primitives.id);
			expect(aggregate.name.value).toBe(primitives.name);
			expect(aggregate.type.value).toBe(primitives.type);
			expect(aggregate.description?.value).toBe(primitives.description);
		});

		it("should create a LocationAggregate from primitives without description", () => {
			const primitives: LocationPrimitives = {
				id: "123e4567-e89b-12d3-a456-426614174000",
				name: "Living Room",
				type: LocationTypeEnum.ROOM,
				description: null,
			};

			const aggregate = factory.fromPrimitives(primitives);

			expect(aggregate).toBeInstanceOf(LocationAggregate);
			expect(aggregate.id.value).toBe(primitives.id);
			expect(aggregate.name.value).toBe(primitives.name);
			expect(aggregate.type.value).toBe(primitives.type);
			expect(aggregate.description).toBeNull();
		});

		it("should create a LocationAggregate from primitives with different types", () => {
			const types = [
				LocationTypeEnum.ROOM,
				LocationTypeEnum.BALCONY,
				LocationTypeEnum.GARDEN,
				LocationTypeEnum.GREENHOUSE,
				LocationTypeEnum.OUTDOOR_SPACE,
				LocationTypeEnum.INDOOR_SPACE,
			];

			types.forEach((type) => {
				const primitives: LocationPrimitives = {
					id: "123e4567-e89b-12d3-a456-426614174000",
					name: "Test Location",
					type,
					description: null,
				};

				const aggregate = factory.fromPrimitives(primitives);

				expect(aggregate.type.value).toBe(type);
			});
		});
	});
});

