import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/entities/user.entity';
import { createUserDTO } from './dtos/createUser.dto';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  users(): User[] {
    return [];
  }

  @Mutation(() => User)
  async createUser(@Args('userInfo') userInfo: createUserDTO) {
    return this.userService.createUser(userInfo);
  }
}
