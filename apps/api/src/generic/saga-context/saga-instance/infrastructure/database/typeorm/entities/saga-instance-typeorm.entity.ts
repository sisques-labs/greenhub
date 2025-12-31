import { Column, Entity, Index } from 'typeorm';
import { SagaInstanceStatusEnum } from '@/generic/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { BaseTypeormEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm.entity';

@Entity('saga_instances')
@Index(['name'], { unique: true })
export class SagaInstanceTypeormEntity extends BaseTypeormEntity {
	@Column({ type: 'varchar' })
	name: string;

	@Column({
		type: 'enum',
		enum: SagaInstanceStatusEnum,
	})
	status: SagaInstanceStatusEnum;

	@Column({ type: 'timestamp', nullable: true })
	startDate: Date | null;

	@Column({ type: 'timestamp', nullable: true })
	endDate: Date | null;
}
