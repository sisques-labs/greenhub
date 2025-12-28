import { Module } from '@nestjs/common';

const MODULES = [];

@Module({
  imports: [...MODULES],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule {}
