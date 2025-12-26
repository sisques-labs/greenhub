import { PlantContextModule } from '@/features/plant-context/plant-context.module';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const FEATURES = [PlantContextModule];

@Module({
  imports: [SharedModule, ...FEATURES],
  controllers: [],
  providers: [],
})
export class FeaturesModule {}
