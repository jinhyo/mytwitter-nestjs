import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/repositories/userRepository';
import { MyJwtModule } from '../my-jwt/my-jwt.module';

@Module({
  imports: [MyJwtModule, TypeOrmModule.forFeature([UserRepository])],
  providers: [UserService, UserResolver],
})
export class UserModule {}
