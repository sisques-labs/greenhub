import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ClerkAuthService } from '@/shared/infrastructure/clerk/services/clerk-auth/clerk-auth.service';

const SERVICES = [ClerkAuthService];

@Global()
@Module({
	imports: [ConfigModule],
	providers: [...SERVICES],
	exports: [...SERVICES],
})
export class ClerkModule {}
