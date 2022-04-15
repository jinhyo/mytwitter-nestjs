import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { join } from 'path';
import { DatabaseModule } from './modules/database/database.module';
import { MyConfigModule } from './modules/my-config/my-config.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    MorganModule,
    MyConfigModule,
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    UserModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('dev'),
    },
  ],
})
export class AppModule {}
