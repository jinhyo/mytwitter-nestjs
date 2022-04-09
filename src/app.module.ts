import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { DatabaseModule } from './modules/database/database.module';
import { MyConfigModule } from './modules/my-config/my-config.module';

@Module({
  imports: [MorganModule, MyConfigModule, DatabaseModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('dev'),
    },
  ],
})
export class AppModule {}
