import { ContainersModule } from '@/features/plant-context/containers/containers.module';
import { PlantsModule } from '@/features/plant-context/plants/plants.module';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const MODULES = [ContainersModule, PlantsModule];

@Module({
  imports: [SharedModule, ...MODULES],
  controllers: [],
  providers: [],
})
export class PlantContextModule {}
