import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SagaContextModule } from './saga-context/saga-context.module';
import { UserModule } from './users/user.module';
import { OverviewModule } from './overview/overview.module';

const GENERIC_MODULES = [
  AuthModule,
  SagaContextModule,
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
