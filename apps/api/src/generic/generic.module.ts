import { AuthModule } from '@/generic/auth/auth.module';
import { OverviewModule } from '@/generic/overview/overview.module';
import { SagaContextModule } from '@/generic/saga-context/saga-context.module';
import { TenantModule } from '@/generic/tenants/tenant.module';
import { UserModule } from '@/generic/users/user.module';
import { Module } from '@nestjs/common';

const GENERIC_MODULES = [
	AuthModule,
	SagaContextModule,
	TenantModule,
	UserModule,
	OverviewModule,
];
@Module({
	imports: [...GENERIC_MODULES],
	controllers: [],
	providers: [],
	exports: [],
})
export class GenericModule {}
