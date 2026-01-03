import { Injectable, Logger } from '@nestjs/common';

import { TenantAggregate } from '@/generic/tenants/domain/aggregates/tenant.aggregate';
import { TenantAggregateFactory } from '@/generic/tenants/domain/factories/aggregates/tenant-aggregate/tenant-aggregate.factory';
import { TenantStatusEnum } from '@/generic/tenants/domain/enums/tenant-status/tenant-status.enum';
import { TenantTypeormEntity } from '@/generic/tenants/infrastructure/database/typeorm/entities/tenant-typeorm.entity';

@Injectable()
export class TenantTypeormMapper {
	private readonly logger = new Logger(TenantTypeormMapper.name);

	constructor(
		private readonly tenantAggregateFactory: TenantAggregateFactory,
	) {}

	/**
	 * Converts a TypeORM entity to a tenant aggregate
	 *
	 * @param entity - The TypeORM entity to convert
	 * @returns The tenant aggregate
	 */
	toDomainEntity(entity: TenantTypeormEntity): TenantAggregate {
		this.logger.log(
			`Converting TypeORM entity to domain entity with id ${entity.id}`,
		);

		return this.tenantAggregateFactory.fromPrimitives({
			id: entity.id,
			clerkId: entity.clerkId,
			name: entity.name,
			status: entity.status,
		});
	}

	/**
	 * Converts a tenant aggregate to a TypeORM entity
	 *
	 * @param aggregate - The tenant aggregate to convert
	 * @returns The TypeORM entity
	 */
	toTypeormEntity(aggregate: TenantAggregate): TenantTypeormEntity {
		this.logger.log(
			`Converting domain entity with id ${aggregate.id.value} to TypeORM entity`,
		);

		const primitives = aggregate.toPrimitives();

		const entity = new TenantTypeormEntity();

		entity.id = primitives.id;
		entity.clerkId = primitives.clerkId;
		entity.name = primitives.name;
		entity.status = primitives.status as TenantStatusEnum;
		entity.deletedAt = null;

		return entity;
	}
}

