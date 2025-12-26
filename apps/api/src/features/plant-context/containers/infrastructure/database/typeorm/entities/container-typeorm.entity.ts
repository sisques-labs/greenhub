import { ContainerTypeEnum } from '@/features/plant-context/containers/domain/enums/container-type/container-type.enum';
import { BaseTypeormWithTenantEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm-with-tenant.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('containers')
@Index(['name'])
export class ContainerTypeormEntity extends BaseTypeormWithTenantEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({
    type: 'enum',
    enum: ContainerTypeEnum,
  })
  type: ContainerTypeEnum;
}
