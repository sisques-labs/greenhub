import { Column, Entity, Index } from 'typeorm';

import { TenantStatusEnum } from '@/generic/tenants/domain/enums/tenant-status/tenant-status.enum';
import { BaseTypeormEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm.entity';

@Entity('tenants')
@Index(['clerkId'])
export class TenantTypeormEntity extends BaseTypeormEntity {
	@Column({ type: 'varchar', nullable: false, unique: true })
	clerkId: string;

	@Column({ type: 'varchar', nullable: false })
	name: string;

	@Column({
		type: 'enum',
		enum: TenantStatusEnum,
	})
	status: TenantStatusEnum;
}

