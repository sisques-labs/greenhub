import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { PlantTypeormEntity } from '@/core/plant-context/infrastructure/database/typeorm/entities/plant-typeorm.entity';
import { LengthUnitEnum } from '@/shared/domain/enums/length-unit/length-unit.enum';
import { BaseTypeormEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('growing-units')
export class GrowingUnitTypeormEntity extends BaseTypeormEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'enum', enum: GrowingUnitTypeEnum })
  type: GrowingUnitTypeEnum;

  @Column({ type: 'integer' })
  capacity: number;

  @Column({ type: 'float', nullable: true })
  length: number | null;

  @Column({ type: 'float', nullable: true })
  width: number | null;

  @Column({ type: 'float', nullable: true })
  height: number | null;

  @Column({ type: 'enum', enum: LengthUnitEnum, nullable: true })
  unit: LengthUnitEnum | null;

  @OneToMany(() => PlantTypeormEntity, (plant) => plant.growingUnit, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  plants: PlantTypeormEntity[];
}
