import { Module } from '@nestjs/common';
import { HealthModule } from '@/support/health/health.module';
import { LoggingModule } from './logging/logging.module';
import { MathModule } from './math/math.module';

const SUPPORT_MODULES = [HealthModule, LoggingModule, MathModule];
@Module({
	imports: [...SUPPORT_MODULES],
	controllers: [],
	providers: [],
	exports: [...SUPPORT_MODULES],
})
export class SupportModule {}
