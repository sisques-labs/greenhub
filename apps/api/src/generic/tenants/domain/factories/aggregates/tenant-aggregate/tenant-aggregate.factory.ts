import { Injectable, Logger } from '@nestjs/common';

import { TenantAggregate } from '@/generic/tenants/domain/aggregates/tenant.aggregate';
import type { ITenantDto } from '@/generic/tenants/domain/dtos/aggregates/tenant/tenant.dto';
import { TenantPrimitives } from '@/generic/tenants/domain/primitives/tenant.primitives';
import { TenantClerkIdValueObject } from '@/generic/tenants/domain/value-objects/tenant-clerk-id/tenant-clerk-id.vo';
import { TenantNameValueObject } from '@/generic/tenants/domain/value-objects/tenant-name/tenant-name.vo';
import { TenantStatusValueObject } from '@/generic/tenants/domain/value-objects/tenant-status/tenant-status.vo';
import type { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';

/**
 * Factory responsible for creating {@link TenantAggregate} entities.
 *
 * @remarks
 * This factory encapsulates logic for constructing `TenantAggregate`
 * instances from DTOs or primitive values. It utilizes value objects to
 * enforce invariants, encapsulate domain logic, and ensure the integrity of tenant data.
 *
 * @example
 * ```typescript
 * const tenantAggregate = tenantAggregateFactory.create(tenantCreateDto);
 * ```
 *
 * @see TenantAggregate
 */
@Injectable()
export class TenantAggregateFactory
	implements IWriteFactory<TenantAggregate, ITenantDto>
{
	private readonly logger = new Logger(TenantAggregateFactory.name);

	/**
	 * Creates a new {@link TenantAggregate} entity using the provided DTO data.
	 *
	 * @param data - The tenant creation data transfer object.
	 * @returns The created TenantAggregate entity.
	 */
	public create(data: ITenantDto): TenantAggregate {
		this.logger.log(
			`Creating TenantAggregate from DTO: ${JSON.stringify(data)}`,
		);
		return new TenantAggregate(data);
	}

	/**
	 * Creates a new {@link TenantAggregate} entity from its primitive property values.
	 *
	 * @param data - The primitive values representing a tenant aggregate.
	 * @param data.id - UUID string representing the tenant identifier.
	 * @param data.clerkId - Clerk ID string representing the tenant's Clerk identifier.
	 * @param data.name - Name of the tenant.
	 * @param data.status - Status of the tenant.
	 * @returns The created TenantAggregate entity, using value objects mapped from the provided primitives.
	 */
	public fromPrimitives(data: TenantPrimitives): TenantAggregate {
		this.logger.log(
			`Creating TenantAggregate from primitives: ${JSON.stringify(data)}`,
		);
		return new TenantAggregate({
			id: new TenantUuidValueObject(data.id),
			clerkId: new TenantClerkIdValueObject(data.clerkId),
			name: new TenantNameValueObject(data.name),
			status: new TenantStatusValueObject(data.status),
		});
	}
}

