import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/entities/user.entity';
import { CreateUserDTO } from './dtos/createUser.dto';
import { LoginDTO } from './dtos/login.dto';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  user() {
    return;
  }

  @Query(() => User)
  login(
    @Args('userInfo') userInfo: LoginDTO,
    @Context() context,
  ): Promise<User> {
    return this.userService.login(userInfo, context.res);
  }

  @Mutation(() => User)
  createUser(@Args('userInfo') userInfo: CreateUserDTO): Promise<User> {
    return this.userService.createUser(userInfo);
  }
}
