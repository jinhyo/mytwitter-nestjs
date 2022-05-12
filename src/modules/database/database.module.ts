import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PWD'),
        database: configService.get('DB_NAME'),
        synchronize: process.env.NODE_ENV !== 'prod',
        timezone: 'Z',
        logging: true,
        entities: ['dist/entities/*.entity{.ts,.js}'],
      }),
    }),
  ],
})
export class DatabaseModule {}
