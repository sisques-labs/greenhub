import { Injectable, Logger } from '@nestjs/common';

import { TenantAggregate } from '@/generic/tenants/domain/aggregates/tenant.aggregate';
import { ITenantViewModelDto } from '@/generic/tenants/domain/dtos/view-models/tenant/tenant-view-model.dto';
import { TenantViewModelClerkIdRequiredException } from '@/generic/tenants/domain/exceptions/tenant-view-model/tenant-view-model-clerk-id-required/tenant-view-model-clerk-id-required.exception';
import { TenantViewModelIdRequiredException } from '@/generic/tenants/domain/exceptions/tenant-view-model/tenant-view-model-id-required/tenant-view-model-id-required.exception';
import { TenantViewModelNameRequiredException } from '@/generic/tenants/domain/exceptions/tenant-view-model/tenant-view-model-name-required/tenant-view-model-name-required.exception';
import { TenantViewModelStatusRequiredException } from '@/generic/tenants/domain/exceptions/tenant-view-model/tenant-view-model-status-required/tenant-view-model-status-required.exception';
import { TenantPrimitives } from '@/generic/tenants/domain/primitives/tenant.primitives';
import { TenantViewModel } from '@/generic/tenants/domain/view-models/tenant/tenant.view-model';

/**
 * Builder class responsible for constructing {@link TenantViewModel} instances using a fluent interface.
 * This builder pattern allows for flexible and readable construction of view models from different sources
 * such as DTOs, primitives, and aggregates.
 *
 * @remarks
 * The builder provides methods to set individual properties and supports building from different data sources.
 * It automatically handles timestamp generation for `createdAt` and `updatedAt` when not explicitly provided.
 *
 * @example
 * ```typescript
 * const builder = new TenantViewModelBuilder();
 * const viewModel = builder
 *   .withId('tenant-1')
 *   .withClerkId('clerk_123456')
 *   .withName('Acme Corp')
 *   .withStatus('ACTIVE')
 *   .build();
 * ```
 *
 * @example
 * ```typescript
 * const builder = new TenantViewModelBuilder();
 * const viewModel = builder.fromPrimitives(primitives).build();
 * ```
 */
@Injectable()
export class TenantViewModelBuilder {
	private readonly logger = new Logger(TenantViewModelBuilder.name);

	private _id: string | null = null;
	private _clerkId: string | null = null;
	private _name: string | null = null;
	private _status: string | null = null;
	private _createdAt: Date | null = null;
	private _updatedAt: Date | null = null;

	/**
	 * Sets the tenant identifier.
	 *
	 * @param id - The tenant identifier
	 * @returns The builder instance for method chaining
	 */
	public withId(id: string): this {
		this._id = id;
		return this;
	}

	/**
	 * Sets the tenant Clerk ID.
	 *
	 * @param clerkId - The tenant Clerk ID
	 * @returns The builder instance for method chaining
	 */
	public withClerkId(clerkId: string): this {
		this._clerkId = clerkId;
		return this;
	}

	/**
	 * Sets the tenant name.
	 *
	 * @param name - The tenant name
	 * @returns The builder instance for method chaining
	 */
	public withName(name: string): this {
		this._name = name;
		return this;
	}

	/**
	 * Sets the tenant status.
	 *
	 * @param status - The tenant status
	 * @returns The builder instance for method chaining
	 */
	public withStatus(status: string): this {
		this._status = status;
		return this;
	}

	/**
	 * Sets the creation timestamp.
	 *
	 * @param createdAt - The creation timestamp
	 * @returns The builder instance for method chaining
	 */
	public withCreatedAt(createdAt: Date): this {
		this._createdAt = createdAt;
		return this;
	}

	/**
	 * Sets the update timestamp.
	 *
	 * @param updatedAt - The update timestamp
	 * @returns The builder instance for method chaining
	 */
	public withUpdatedAt(updatedAt: Date): this {
		this._updatedAt = updatedAt;
		return this;
	}

	/**
	 * Populates the builder from a DTO.
	 *
	 * @param dto - The DTO containing tenant view model data
	 * @returns The builder instance for method chaining
	 */
	public fromDto(dto: ITenantViewModelDto): this {
		this.logger.log(`Populating builder from DTO: ${JSON.stringify(dto)}`);

		this._id = dto.id;
		this._clerkId = dto.clerkId;
		this._name = dto.name;
		this._status = dto.status;
		this._createdAt = dto.createdAt ?? null;
		this._updatedAt = dto.updatedAt ?? null;

		return this;
	}

	/**
	 * Populates the builder from primitives.
	 *
	 * @param primitives - The primitives object representing low-level tenant data
	 * @returns The builder instance for method chaining
	 */
	public fromPrimitives(primitives: TenantPrimitives): this {
		this.logger.log(
			`Populating builder from primitives: ${JSON.stringify(primitives)}`,
		);

		const now = new Date();

		this._id = primitives.id;
		this._clerkId = primitives.clerkId;
		this._name = primitives.name;
		this._status = primitives.status;
		this._createdAt = now;
		this._updatedAt = now;

		return this;
	}

	/**
	 * Populates the builder from an aggregate.
	 *
	 * @param aggregate - The tenant aggregate containing domain properties
	 * @returns The builder instance for method chaining
	 */
	public fromAggregate(aggregate: TenantAggregate): this {
		this.logger.log(`Populating builder from aggregate: ${aggregate.id.value}`);

		const now = new Date();

		this._id = aggregate.id.value;
		this._clerkId = aggregate.clerkId.value;
		this._name = aggregate.name.value;
		this._status = aggregate.status.value;
		this._createdAt = now;
		this._updatedAt = now;

		return this;
	}

	/**
	 * Resets the builder to its initial state.
	 *
	 * @returns The builder instance for method chaining
	 */
	public reset(): this {
		this._id = null;
		this._clerkId = null;
		this._name = null;
		this._status = null;
		this._createdAt = null;
		this._updatedAt = null;

		return this;
	}

	/**
	 * Builds and returns the {@link TenantViewModel} instance.
	 *
	 * @returns The constructed {@link TenantViewModel}
	 * @throws {TenantViewModelIdRequiredException} If id is missing
	 * @throws {TenantViewModelClerkIdRequiredException} If clerkId is missing
	 * @throws {TenantViewModelNameRequiredException} If name is missing
	 * @throws {TenantViewModelStatusRequiredException} If status is missing
	 */
	public build(): TenantViewModel {
		this.logger.log('Building TenantViewModel from builder');

		const now = new Date();

		// Validate required fields
		if (!this._id) {
			throw new TenantViewModelIdRequiredException();
		}

		if (!this._clerkId) {
			throw new TenantViewModelClerkIdRequiredException();
		}

		if (!this._name) {
			throw new TenantViewModelNameRequiredException();
		}

		if (!this._status) {
			throw new TenantViewModelStatusRequiredException();
		}

		const dto: ITenantViewModelDto = {
			id: this._id,
			clerkId: this._clerkId,
			name: this._name,
			status: this._status,
			createdAt: this._createdAt ?? now,
			updatedAt: this._updatedAt ?? now,
		};

		return new TenantViewModel(dto);
	}
}
