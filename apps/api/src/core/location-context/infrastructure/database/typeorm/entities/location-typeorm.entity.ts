import { Column, Entity, Index } from 'typeorm';

import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import { BaseTypeormEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm.entity';

@Entity('locations')
@Index(['name'])
@Index(['type'])
export class LocationTypeormEntity extends BaseTypeormEntity {
	@Column({ type: 'varchar' })
	name: string;

	@Column({ type: 'enum', enum: LocationTypeEnum })
	type: LocationTypeEnum;

	@Column({ type: 'varchar', nullable: true })
	description: string | null;
}

