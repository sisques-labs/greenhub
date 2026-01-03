import type { ITenantViewModelDto } from '@/generic/tenants/domain/dtos/view-models/tenant/tenant-view-model.dto';
import { BaseViewModel } from '@/shared/domain/view-models/base-view-model/base-view-model';

/**
 * Represents a tenant view model for the presentation layer.
 *
 * @remarks
 * This class provides a structured, immutable interface for tenant data used in API responses
 * and view logic. It exposes tenant properties as read-only fields and provides a method to
 * update the model instance with new data. Mutations through the update method adjust
 * the underlying data and refresh the update timestamp.
 *
 * @example
 * ```typescript
 * const model = new TenantViewModel({
 *   id: 'tenant-1',
 *   clerkId: 'clerk_123456',
 *   name: 'Acme Corp',
 *   status: 'ACTIVE',
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 * });
 * ```
 */
export class TenantViewModel extends BaseViewModel {
	private readonly _clerkId: string;
	private _name: string;
	private _status: string;

	/**
	 * Creates a new TenantViewModel instance.
	 *
	 * @param props - The tenant creation view model data used for initialization
	 */
	constructor(props: ITenantViewModelDto) {
		super(props);
		this._clerkId = props.clerkId;
		this._name = props.name;
		this._status = props.status;
	}

	/**
	 * Gets the tenant's Clerk ID.
	 *
	 * @readonly
	 * @returns The Clerk ID of the tenant
	 */
	public get clerkId(): string {
		return this._clerkId;
	}

	/**
	 * Gets the tenant's name.
	 *
	 * @returns The name of the tenant
	 */
	public get name(): string {
		return this._name;
	}

	/**
	 * Gets the tenant's status.
	 *
	 * @returns The status of the tenant
	 */
	public get status(): string {
		return this._status;
	}

	/**
	 * Updates the tenant view model with new data.
	 *
	 * @param updateData - The partial update view model data for the tenant
	 * @returns void
	 *
	 * @example
	 * ```typescript
	 * tenantViewModel.update({ name: 'Acme Corp Updated', status: 'INACTIVE' });
	 * ```
	 */
	public update(updateData: ITenantViewModelDto): void {
		this._name = updateData.name;
		this._status = updateData.status;

		this._updatedAt = new Date();
	}
}
