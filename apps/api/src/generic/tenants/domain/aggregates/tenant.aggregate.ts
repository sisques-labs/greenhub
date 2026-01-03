import { ITenantDto } from '@/generic/tenants/domain/dtos/aggregates/tenant/tenant.dto';
import { TenantNameChangedEvent } from '@/generic/tenants/domain/events/tenant/field-changed/tenant-name-changed/tenant-name-changed.event';
import { TenantStatusChangedEvent } from '@/generic/tenants/domain/events/tenant/field-changed/tenant-status-changed/tenant-status-changed.event';
import { TenantPrimitives } from '@/generic/tenants/domain/primitives/tenant.primitives';
import { TenantClerkIdValueObject } from '@/generic/tenants/domain/value-objects/tenant-clerk-id/tenant-clerk-id.vo';
import { TenantNameValueObject } from '@/generic/tenants/domain/value-objects/tenant-name/tenant-name.vo';
import { TenantStatusValueObject } from '@/generic/tenants/domain/value-objects/tenant-status/tenant-status.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { AggregateRoot } from '@nestjs/cqrs';

/**
 * Aggregate root class representing a Tenant entity in the system.
 * Handles domain behaviors, state, events, and provides read/serialization access.
 *
 * @class TenantAggregate
 * @extends {AggregateRoot}
 */
export class TenantAggregate extends AggregateRoot {
	/**
	 * The unique identifier of the tenant.
	 * @private
	 * @readonly
	 * @type {TenantUuidValueObject}
	 */
	private readonly _id: TenantUuidValueObject;

	/**
	 * The Clerk ID of the tenant.
	 * @private
	 * @readonly
	 * @type {TenantClerkIdValueObject}
	 */
	private readonly _clerkId: TenantClerkIdValueObject;

	/**
	 * The name of the tenant.
	 * @private
	 * @type {TenantNameValueObject}
	 */
	private _name: TenantNameValueObject;

	/**
	 * The status of the tenant.
	 * @private
	 * @type {TenantStatusValueObject}
	 */
	private _status: TenantStatusValueObject;

	/**
	 * Constructs a TenantAggregate instance.
	 *
	 * @param {ITenantDto} props - DTO containing the properties for the tenant.
	 */
	constructor(props: ITenantDto) {
		super();

		// Set the properties
		this._id = props.id;
		this._clerkId = props.clerkId;
		this._name = props.name;
		this._status = props.status;
	}

	/**
	 * Changes the name of the tenant, applying a domain event.
	 *
	 * @param {TenantNameValueObject} name - The new tenant name value object.
	 * @returns {void}
	 */
	public changeName(name: TenantNameValueObject): void {
		const oldValue = this._name.value;
		this._name = name;

		this.apply(
			new TenantNameChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: TenantAggregate.name,
					entityId: this._id.value,
					entityType: TenantAggregate.name,
					eventType: TenantNameChangedEvent.name,
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
	 * Changes the status of the tenant, applying a domain event.
	 *
	 * @param {TenantStatusValueObject} status - The new tenant status value object.
	 * @returns {void}
	 */
	public changeStatus(status: TenantStatusValueObject): void {
		const oldValue = this._status.value;
		this._status = status;

		this.apply(
			new TenantStatusChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: TenantAggregate.name,
					entityId: this._id.value,
					entityType: TenantAggregate.name,
					eventType: TenantStatusChangedEvent.name,
				},
				{
					id: this._id.value,
					oldValue,
					newValue: this._status.value,
				},
			),
		);
	}

	/**
	 * Gets the tenant's UUID value object.
	 *
	 * @readonly
	 * @type {TenantUuidValueObject}
	 */
	public get id(): TenantUuidValueObject {
		return this._id;
	}

	/**
	 * Gets the tenant's Clerk ID value object.
	 *
	 * @readonly
	 * @type {TenantClerkIdValueObject}
	 */
	public get clerkId(): TenantClerkIdValueObject {
		return this._clerkId;
	}

	/**
	 * Gets the tenant's name value object.
	 *
	 * @readonly
	 * @type {TenantNameValueObject}
	 */
	public get name(): TenantNameValueObject {
		return this._name;
	}

	/**
	 * Gets the tenant's status value object.
	 *
	 * @readonly
	 * @type {TenantStatusValueObject}
	 */
	public get status(): TenantStatusValueObject {
		return this._status;
	}

	/**
	 * Serializes the aggregate's state into primitives for persistence or transport.
	 *
	 * @returns {TenantPrimitives} Primitives representation of the tenant.
	 */
	public toPrimitives(): TenantPrimitives {
		return {
			id: this._id.value,
			clerkId: this._clerkId.value,
			name: this._name.value,
			status: this._status.value,
		};
	}
}
