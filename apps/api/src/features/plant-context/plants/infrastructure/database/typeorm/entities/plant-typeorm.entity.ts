import { PlantStatusEnum } from '@/features/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { BaseTypeormWithTenantEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm-with-tenant.entity';
import { Column, Entity } from 'typeorm';

@Entity('plants')
export class PlantTypeormEntity extends BaseTypeormWithTenantEntity {
  @Column({ type: 'uuid' })
  containerId: string;

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
