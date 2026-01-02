import { LocationAggregate } from "@/core/location-context/domain/aggregates/location.aggregate";
import type { ILocationDto } from "@/core/location-context/domain/dtos/entities/location/location.dto";
import { LocationTypeEnum } from "@/core/location-context/domain/enums/location-type/location-type.enum";
import { LocationDescriptionChangedEvent } from "@/core/location-context/domain/events/location/field-changed/location-description-changed/location-description-changed.event";
import { LocationNameChangedEvent } from "@/core/location-context/domain/events/location/field-changed/location-name-changed/location-name-changed.event";
import { LocationTypeChangedEvent } from "@/core/location-context/domain/events/location/field-changed/location-type-changed/location-type-changed.event";
import { LocationDescriptionValueObject } from "@/core/location-context/domain/value-objects/location/location-description/location-description.vo";
import { LocationNameValueObject } from "@/core/location-context/domain/value-objects/location/location-name/location-name.vo";
import { LocationTypeValueObject } from "@/core/location-context/domain/value-objects/location/location-type/location-type.vo";
import { LocationUuidValueObject } from "@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo";

describe("LocationAggregate", () => {
	let locationId: LocationUuidValueObject;
	let locationDto: ILocationDto;

	beforeEach(() => {
		locationId = new LocationUuidValueObject();

		locationDto = {
			id: locationId,
			name: new LocationNameValueObject("Living Room"),
			type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
			description: new LocationDescriptionValueObject(
				"North-facing room with good sunlight",
			),
		};
	});

	describe("constructor", () => {
		it("should create a location aggregate with all properties", () => {
			const aggregate = new LocationAggregate(locationDto);

			expect(aggregate.id).toBe(locationId);
			expect(aggregate.name.value).toBe("Living Room");
			expect(aggregate.type.value).toBe(LocationTypeEnum.ROOM);
			expect(aggregate.description?.value).toBe(
				"North-facing room with good sunlight",
			);
		});

		it("should create a location aggregate without description", () => {
			const dtoWithoutDescription: ILocationDto = {
				...locationDto,
				description: null,
			};

			const aggregate = new LocationAggregate(dtoWithoutDescription);

			expect(aggregate.description).toBeNull();
		});

		it("should not generate events by default", () => {
			const aggregate = new LocationAggregate(locationDto);
			const events = aggregate.getUncommittedEvents();

			expect(events).toHaveLength(0);
		});
	});

	describe("changeName", () => {
		it("should change the location name", () => {
			const aggregate = new LocationAggregate(locationDto);
			const newName = new LocationNameValueObject("Kitchen");

			aggregate.changeName(newName);

			expect(aggregate.name.value).toBe("Kitchen");
		});

		it("should generate LocationNameChangedEvent", () => {
			const aggregate = new LocationAggregate(locationDto);
			const newName = new LocationNameValueObject("Kitchen");

			aggregate.changeName(newName);

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(LocationNameChangedEvent);

			const event = events[0] as LocationNameChangedEvent;
			expect(event.data.oldValue).toBe("Living Room");
			expect(event.data.newValue).toBe("Kitchen");
			expect(event.data.id).toBe(locationId.value);
		});
	});

	describe("changeType", () => {
		it("should change the location type", () => {
			const aggregate = new LocationAggregate(locationDto);
			const newType = new LocationTypeValueObject(LocationTypeEnum.BALCONY);

			aggregate.changeType(newType);

			expect(aggregate.type.value).toBe(LocationTypeEnum.BALCONY);
		});

		it("should generate LocationTypeChangedEvent", () => {
			const aggregate = new LocationAggregate(locationDto);
			const newType = new LocationTypeValueObject(LocationTypeEnum.BALCONY);

			aggregate.changeType(newType);

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(LocationTypeChangedEvent);

			const event = events[0] as LocationTypeChangedEvent;
			expect(event.data.oldValue).toBe(LocationTypeEnum.ROOM);
			expect(event.data.newValue).toBe(LocationTypeEnum.BALCONY);
			expect(event.data.id).toBe(locationId.value);
		});
	});

	describe("changeDescription", () => {
		it("should change the location description", () => {
			const aggregate = new LocationAggregate(locationDto);
			const newDescription = new LocationDescriptionValueObject(
				"Updated description",
			);

			aggregate.changeDescription(newDescription);

			expect(aggregate.description?.value).toBe("Updated description");
		});

		it("should set description to null", () => {
			const aggregate = new LocationAggregate(locationDto);

			aggregate.changeDescription(null);

			expect(aggregate.description).toBeNull();
		});

		it("should generate LocationDescriptionChangedEvent when changing description", () => {
			const aggregate = new LocationAggregate(locationDto);
			const newDescription = new LocationDescriptionValueObject(
				"Updated description",
			);

			aggregate.changeDescription(newDescription);

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(LocationDescriptionChangedEvent);

			const event = events[0] as LocationDescriptionChangedEvent;
			expect(event.data.oldValue).toBe("North-facing room with good sunlight");
			expect(event.data.newValue).toBe("Updated description");
			expect(event.data.id).toBe(locationId.value);
		});

		it("should generate LocationDescriptionChangedEvent when setting description to null", () => {
			const aggregate = new LocationAggregate(locationDto);

			aggregate.changeDescription(null);

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(LocationDescriptionChangedEvent);

			const event = events[0] as LocationDescriptionChangedEvent;
			expect(event.data.oldValue).toBe("North-facing room with good sunlight");
			expect(event.data.newValue).toBeNull();
			expect(event.data.id).toBe(locationId.value);
		});

		it("should generate LocationDescriptionChangedEvent when setting description from null", () => {
			const dtoWithoutDescription: ILocationDto = {
				...locationDto,
				description: null,
			};
			const aggregate = new LocationAggregate(dtoWithoutDescription);
			const newDescription = new LocationDescriptionValueObject(
				"New description",
			);

			aggregate.changeDescription(newDescription);

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(LocationDescriptionChangedEvent);

			const event = events[0] as LocationDescriptionChangedEvent;
			expect(event.data.oldValue).toBeNull();
			expect(event.data.newValue).toBe("New description");
			expect(event.data.id).toBe(locationId.value);
		});
	});

	describe("getters", () => {
		it("should return the id", () => {
			const aggregate = new LocationAggregate(locationDto);

			expect(aggregate.id).toBe(locationId);
		});

		it("should return the name", () => {
			const aggregate = new LocationAggregate(locationDto);

			expect(aggregate.name.value).toBe("Living Room");
		});

		it("should return the type", () => {
			const aggregate = new LocationAggregate(locationDto);

			expect(aggregate.type.value).toBe(LocationTypeEnum.ROOM);
		});

		it("should return the description", () => {
			const aggregate = new LocationAggregate(locationDto);

			expect(aggregate.description?.value).toBe(
				"North-facing room with good sunlight",
			);
		});
	});

	describe("toPrimitives", () => {
		it("should convert aggregate to primitives", () => {
			const aggregate = new LocationAggregate(locationDto);

			const primitives = aggregate.toPrimitives();

			expect(primitives.id).toBe(locationId.value);
			expect(primitives.name).toBe("Living Room");
			expect(primitives.type).toBe(LocationTypeEnum.ROOM);
			expect(primitives.description).toBe("North-facing room with good sunlight");
		});

		it("should convert aggregate to primitives with null description", () => {
			const dtoWithoutDescription: ILocationDto = {
				...locationDto,
				description: null,
			};
			const aggregate = new LocationAggregate(dtoWithoutDescription);

			const primitives = aggregate.toPrimitives();

			expect(primitives.id).toBe(locationId.value);
			expect(primitives.name).toBe("Living Room");
			expect(primitives.type).toBe(LocationTypeEnum.ROOM);
			expect(primitives.description).toBeNull();
		});
	});
});

