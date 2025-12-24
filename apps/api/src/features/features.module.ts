import { PlantsModule } from '@/features/plants/plants.module';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const FEATURES = [PlantsModule];

@Module({
  imports: [SharedModule, ...FEATURES],
  controllers: [],
  providers: [],
})
export class FeaturesModule {}
