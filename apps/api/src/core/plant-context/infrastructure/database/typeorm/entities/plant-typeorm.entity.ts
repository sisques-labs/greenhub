import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { GrowingUnitTypeormEntity } from '@/core/plant-context/infrastructure/database/typeorm/entities/growing-unit-typeorm.entity';
import { BaseTypeormEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm.entity';

@Entity('plants')
export class PlantTypeormEntity extends BaseTypeormEntity {
	@Column({ type: 'uuid' })
	@Index()
	growingUnitId: string;

	@ManyToOne(
		() => GrowingUnitTypeormEntity,
		(growingUnit) => growingUnit.plants,
		{
			onDelete: 'CASCADE',
		},
	)
	@JoinColumn({ name: 'growingUnitId' })
	growingUnit: GrowingUnitTypeormEntity;

	@Column({ type: 'varchar' })
	name: string;

	@Column({ type: 'varchar' })
	species: string;

	@Column({ type: 'date', nullable: true })
	plantedDate: Date | null;

	@Column({ type: 'text', nullable: true })
	notes: string | null;

	@Column({
		type: 'enum',
		enum: PlantStatusEnum,
	})
	status: PlantStatusEnum;
}
