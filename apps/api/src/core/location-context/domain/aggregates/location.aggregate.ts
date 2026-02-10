import { AggregateRoot } from "@nestjs/cqrs";

import type { ILocationDto } from "@/core/location-context/domain/dtos/entities/location/location.dto";
import { LocationDescriptionChangedEvent } from "@/core/location-context/domain/events/location/field-changed/location-description-changed/location-description-changed.event";
import { LocationNameChangedEvent } from "@/core/location-context/domain/events/location/field-changed/location-name-changed/location-name-changed.event";
import { LocationTypeChangedEvent } from "@/core/location-context/domain/events/location/field-changed/location-type-changed/location-type-changed.event";
import type { LocationPrimitives } from "@/core/location-context/domain/primitives/location.primitives";
import type { LocationDescriptionValueObject } from "@/core/location-context/domain/value-objects/location/location-description/location-description.vo";
import type { LocationNameValueObject } from "@/core/location-context/domain/value-objects/location/location-name/location-name.vo";
import type { LocationTypeValueObject } from "@/core/location-context/domain/value-objects/location/location-type/location-type.vo";
import type { LocationUuidValueObject } from "@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo";

/**
 * The aggregate root representing a location, which manages physical or logical spaces
 * where plants and growing units can be organized.
 *
 * @remarks
 * - Handles changes to location properties.
 * - Supports hierarchical locations through parentLocationId.
 * - Emits domain events for state changes.
 */
export class LocationAggregate extends AggregateRoot {
	/**
	 * The unique identifier of this location.
	 */
	private readonly _id: LocationUuidValueObject;

	/**
	 * The name of this location.
	 */
	private _name: LocationNameValueObject;

	/**
	 * The type of this location.
	 */
	private _type: LocationTypeValueObject;

	/**
	 * The description of this location.
	 */
	private _description: LocationDescriptionValueObject | null;

	/**
	 * Creates a new LocationAggregate.
	 *
	 * @param props - The properties to initialize the location with.
	 */
	constructor(props: ILocationDto) {
		super();

		this._id = props.id;
		this._name = props.name;
		this._type = props.type;
		this._description = props.description;
	}

	/**
	 * Changes the name of this location.
	 *
	 * @param name - The new name value object.
	 */
	public changeName(name: LocationNameValueObject) {
		const oldValue = this._name.value;
		this._name = name;

		this.apply(
			new LocationNameChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: LocationAggregate.name,
					entityId: this._id.value,
					entityType: LocationAggregate.name,
					eventType: LocationNameChangedEvent.name,
				},
				{
					id: this._id.value,
					oldValue,
					newValue: this._name.value,
				},
			),
		);
	}

	/**
	 * Changes the type of this location.
	 *
	 * @param type - The new type value object.
	 */
	public changeType(type: LocationTypeValueObject) {
		const oldValue = this._type.value;
		this._type = type;

		this.apply(
			new LocationTypeChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: LocationAggregate.name,
					entityId: this._id.value,
					entityType: LocationAggregate.name,
					eventType: LocationTypeChangedEvent.name,
				},
				{
					id: this._id.value,
					oldValue,
					newValue: this._type.value,
				},
			),
		);
	}

	/**
	 * Changes the description of this location.
	 *
	 * @param description - The new description value object or null.
	 */
	public changeDescription(description: LocationDescriptionValueObject | null) {
		const oldValue = this._description?.value ?? null;
		this._description = description;

		this.apply(
			new LocationDescriptionChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: LocationAggregate.name,
					entityId: this._id.value,
					entityType: LocationAggregate.name,
					eventType: LocationDescriptionChangedEvent.name,
				},
				{
					id: this._id.value,
					oldValue,
					newValue: this._description?.value ?? null,
				},
			),
		);
	}

	/**
	 * The unique identifier of this location.
	 */
	public get id(): LocationUuidValueObject {
		return this._id;
	}

	/**
	 * The name of this location.
	 */
	public get name(): LocationNameValueObject {
		return this._name;
	}

	/**
	 * The type of this location.
	 */
	public get type(): LocationTypeValueObject {
		return this._type;
	}

	/**
	 * The description of this location.
	 */
	public get description(): LocationDescriptionValueObject | null {
		return this._description;
	}

	/**
	 * Converts the location to its primitive representation for serialization.
	 *
	 * @returns Primitives representing the location.
	 */
	public toPrimitives(): LocationPrimitives {
		return {
			id: this._id.value,
			name: this._name.value,
			type: this._type.value,
			description: this._description?.value ?? null,
		};
	}
}
