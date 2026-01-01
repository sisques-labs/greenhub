import { LocationContextModule } from '@/core/location-context/location-context.module';
import { PlantContextModule } from '@/core/plant-context/plant-context.module';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const MODULES = [PlantContextModule, LocationContextModule];

@Module({
	imports: [SharedModule, ...MODULES],
	controllers: [],
	providers: [],
	exports: [],
})
export class CoreModule {}
