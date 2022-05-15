import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLFormattedError } from 'graphql';
import { join } from 'path';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { DatabaseModule } from './modules/database/database.module';
import { MyConfigModule } from './modules/my-config/my-config.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    MyConfigModule,
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      formatError: (error) => {
        return error.extensions.response as GraphQLFormattedError;
      },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ res }) => ({
        res,
      }),
    }),
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.POST });
  }
}
