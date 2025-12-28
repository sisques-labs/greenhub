import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import { BaseTypeormEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('containers')
@Index(['name'])
export class ContainerTypeormEntity extends BaseTypeormEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({
    type: 'enum',
    enum: ContainerTypeEnum,
  })
  type: ContainerTypeEnum;
}
