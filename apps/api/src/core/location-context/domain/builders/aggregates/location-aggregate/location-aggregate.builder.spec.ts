import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import { LocationAggregateBuilder } from '@/core/location-context/domain/builders/aggregates/location-aggregate/location-aggregate.builder';
import type { LocationPrimitives } from '@/core/location-context/domain/primitives/location.primitives';
import { LocationDescriptionValueObject } from '@/core/location-context/domain/value-objects/location/location-description/location-description.vo';
import { LocationNameValueObject } from '@/core/location-context/domain/value-objects/location/location-name/location-name.vo';
import { LocationTypeValueObject } from '@/core/location-context/domain/value-objects/location/location-type/location-type.vo';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';

describe('LocationAggregateBuilder', () => {
	let builder: LocationAggregateBuilder;

	beforeEach(() => {
		builder = new LocationAggregateBuilder();
	});

	describe('build', () => {
		it('should build a LocationAggregate with all required fields', () => {
			// Arrange
			const id = new LocationUuidValueObject();
			const name = new LocationNameValueObject('Greenhouse 1');
			const type = new LocationTypeValueObject('GREENHOUSE');

			// Act
			const location = builder
				.withId(id)
				.withName(name)
				.withType(type)
				.build();

			// Assert
			expect(location).toBeInstanceOf(LocationAggregate);
			expect(location.id.value).toBe(id.value);
			expect(location.name.value).toBe(name.value);
			expect(location.type.value).toBe(type.value);
			expect(location.description).toBeNull();
		});

		it('should build a LocationAggregate with optional description', () => {
			// Arrange
			const id = new LocationUuidValueObject();
			const name = new LocationNameValueObject('Greenhouse 1');
			const type = new LocationTypeValueObject('GREENHOUSE');
			const description = new LocationDescriptionValueObject(
				'Main greenhouse for tomatoes',
			);

			// Act
			const location = builder
				.withId(id)
				.withName(name)
				.withType(type)
				.withDescription(description)
				.build();

			// Assert
			expect(location.description).not.toBeNull();
			expect(location.description!.value).toBe(description.value);
		});

		it('should throw error when building without required id', () => {
			// Arrange
			const name = new LocationNameValueObject('Greenhouse 1');
			const type = new LocationTypeValueObject('GREENHOUSE');

			// Act & Assert
			expect(() => {
				builder.withName(name).withType(type).build();
			}).toThrow('Cannot build LocationAggregate: missing required fields: id');
		});

		it('should throw error when building without required name', () => {
			// Arrange
			const id = new LocationUuidValueObject();
			const type = new LocationTypeValueObject('GREENHOUSE');

			// Act & Assert
			expect(() => {
				builder.withId(id).withType(type).build();
			}).toThrow(
				'Cannot build LocationAggregate: missing required fields: name',
			);
		});

		it('should throw error when building without required type', () => {
			// Arrange
			const id = new LocationUuidValueObject();
			const name = new LocationNameValueObject('Greenhouse 1');

			// Act & Assert
			expect(() => {
				builder.withId(id).withName(name).build();
			}).toThrow(
				'Cannot build LocationAggregate: missing required fields: type',
			);
		});

		it('should throw error listing all missing required fields', () => {
			// Act & Assert
			expect(() => {
				builder.build();
			}).toThrow(
				'Cannot build LocationAggregate: missing required fields: id, name, type',
			);
		});
	});

	describe('fromPrimitives', () => {
		it('should initialize builder from primitives and build aggregate', () => {
			// Arrange
			const primitives: LocationPrimitives = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				name: 'Greenhouse 1',
				type: 'GREENHOUSE',
				description: 'Main greenhouse',
			};

			// Act
			const location = builder.fromPrimitives(primitives).build();

			// Assert
			expect(location).toBeInstanceOf(LocationAggregate);
			expect(location.id.value).toBe(primitives.id);
			expect(location.name.value).toBe(primitives.name);
			expect(location.type.value).toBe(primitives.type);
			expect(location.description!.value).toBe(primitives.description);
		});

		it('should handle null description when building from primitives', () => {
			// Arrange
			const primitives: LocationPrimitives = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				name: 'Greenhouse 1',
				type: 'GREENHOUSE',
				description: null,
			};

			// Act
			const location = builder.fromPrimitives(primitives).build();

			// Assert
			expect(location.description).toBeNull();
		});
	});

	describe('reset', () => {
		it('should reset builder state and allow building a new aggregate', () => {
			// Arrange
			const id1 = new LocationUuidValueObject();
			const name1 = new LocationNameValueObject('Greenhouse 1');
			const type1 = new LocationTypeValueObject('GREENHOUSE');

			const id2 = new LocationUuidValueObject();
			const name2 = new LocationNameValueObject('Greenhouse 2');
			const type2 = new LocationTypeValueObject('INDOOR_SPACE');

			// Act
			const location1 = builder
				.withId(id1)
				.withName(name1)
				.withType(type1)
				.build();

			builder.reset();

			const location2 = builder
				.withId(id2)
				.withName(name2)
				.withType(type2)
				.build();

			// Assert
			expect(location1.id.value).toBe(id1.value);
			expect(location1.name.value).toBe(name1.value);
			expect(location2.id.value).toBe(id2.value);
			expect(location2.name.value).toBe(name2.value);
		});

		it('should throw error after reset if build is called without setting fields', () => {
			// Arrange
			const id = new LocationUuidValueObject();
			const name = new LocationNameValueObject('Greenhouse 1');
			const type = new LocationTypeValueObject('GREENHOUSE');

			builder.withId(id).withName(name).withType(type).build();

			// Act
			builder.reset();

			// Assert
			expect(() => builder.build()).toThrow(
				'Cannot build LocationAggregate: missing required fields: id, name, type',
			);
		});
	});

	describe('fluent API', () => {
		it('should support method chaining', () => {
			// Arrange
			const id = new LocationUuidValueObject();
			const name = new LocationNameValueObject('Greenhouse 1');
			const type = new LocationTypeValueObject('GREENHOUSE');
			const description = new LocationDescriptionValueObject('Description');

			// Act
			const location = builder
				.withId(id)
				.withName(name)
				.withType(type)
				.withDescription(description)
				.build();

			// Assert
			expect(location).toBeInstanceOf(LocationAggregate);
		});

		it('should allow overwriting values before build', () => {
			// Arrange
			const id = new LocationUuidValueObject();
			const firstName = new LocationNameValueObject('Old Name');
			const secondName = new LocationNameValueObject('New Name');
			const type = new LocationTypeValueObject('GREENHOUSE');

			// Act
			const location = builder
				.withId(id)
				.withName(firstName)
				.withName(secondName) // Overwrite
				.withType(type)
				.build();

			// Assert
			expect(location.name.value).toBe(secondName.value);
		});
	});
});
