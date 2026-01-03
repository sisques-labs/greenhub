import { Injectable, Logger } from '@nestjs/common';

import { TenantAggregate } from '@/generic/tenants/domain/aggregates/tenant.aggregate';
import {
	ITenantWriteRepository,
	TENANT_WRITE_REPOSITORY_TOKEN,
} from '@/generic/tenants/domain/repositories/tenant-write/tenant-write.repository';
import { TenantTypeormEntity } from '@/generic/tenants/infrastructure/database/typeorm/entities/tenant-typeorm.entity';
import { TenantTypeormMapper } from '@/generic/tenants/infrastructure/database/typeorm/mappers/tenant-typeorm.mapper';
import { BaseTypeormMasterRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';

@Injectable()
export class TenantTypeormRepository
	extends BaseTypeormMasterRepository<TenantTypeormEntity>
	implements ITenantWriteRepository
{
	constructor(
		typeormMasterService: TypeormMasterService,
		private readonly tenantTypeormMapper: TenantTypeormMapper,
	) {
		super(typeormMasterService, TenantTypeormEntity);
		this.logger = new Logger(TenantTypeormRepository.name);
	}

	/**
	 * Finds a tenant by id
	 *
	 * @param id - The id of the tenant to find
	 * @returns The tenant if found, null otherwise
	 */
	async findById(id: string): Promise<TenantAggregate | null> {
		this.logger.log(`Finding tenant by id: ${id}`);
		const entity = await this.repository.findOne({
			where: { id },
		});

		if (!entity) {
			return null;
		}

		return this.tenantTypeormMapper.toDomainEntity(entity);
	}

	/**
	 * Saves a tenant
	 *
	 * @param tenant - The tenant to save
	 * @returns The saved tenant
	 */
	async save(tenant: TenantAggregate): Promise<TenantAggregate> {
		this.logger.log(`Saving tenant: ${tenant.id.value}`);
		const entity = this.tenantTypeormMapper.toTypeormEntity(tenant);

		const savedEntity = await this.repository.save(entity);

		return this.tenantTypeormMapper.toDomainEntity(savedEntity);
	}

	/**
	 * Finds a tenant by Clerk ID
	 *
	 * @param clerkId - The Clerk ID of the tenant to find
	 * @returns The tenant if found, null otherwise
	 */
	async findByClerkId(clerkId: string): Promise<TenantAggregate | null> {
		this.logger.log(`Finding tenant by Clerk ID: ${clerkId}`);
		const entity = await this.repository.findOne({
			where: { clerkId },
		});

		if (!entity) {
			return null;
		}

		return this.tenantTypeormMapper.toDomainEntity(entity);
	}

	/**
	 * Deletes a tenant (soft delete)
	 *
	 * @param id - The id of the tenant to delete
	 */
	async delete(id: string): Promise<void> {
		this.logger.log(`Soft deleting tenant by id: ${id}`);
		await this.repository.softDelete(id);
	}
}

