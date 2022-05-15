import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/repositories/user.repository';
import { MyJwtModule } from '../my-jwt/my-jwt.module';
import { S3Module } from '../S3/S3.module';
import { UserRelationRepository } from 'src/repositories/userRelation.repository';

@Module({
  imports: [
    S3Module,
    MyJwtModule,
    TypeOrmModule.forFeature([UserRepository, UserRelationRepository]),
  ],
  providers: [UserService, UserResolver],
})
export class UserModule {}
