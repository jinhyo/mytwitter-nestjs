import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AvailableDTO } from 'src/commonDTOs/available.dto';
import { SuccessDTO } from 'src/commonDTOs/success.dto';
import { LoginUser } from 'src/decorators/loginUser.decorator';
import { User } from 'src/entities/user.entity';
import { LoginGuard } from 'src/guards/login.guard';
import { CreateUserDTO } from './dtos/createUser.dto';
import { LoginDTO } from './dtos/login.dto';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(LoginGuard)
  me(@LoginUser() loginUser: User) {
    return loginUser;
  }

  @Mutation(() => SuccessDTO)
  @UseGuards(LoginGuard)
  logout(@Context() context): SuccessDTO {
    context.res.cookie('token', '', { maxAge: 0 });
    return { isSuccess: true };
  }

  @Mutation(() => User)
  login(
    @Args('userInfo') userInfo: LoginDTO,
    @Context() context,
  ): Promise<User> {
    return this.userService.login(userInfo, context.res);
  }

  @Mutation(() => AvailableDTO)
  isDuplicateNickname(
    @Args('nickname') nickname: string,
  ): Promise<AvailableDTO> {
    return this.userService.isDuplicateNickname(nickname);
  }

  @Mutation(() => User)
  createUser(@Args('userInfo') userInfo: CreateUserDTO): Promise<User> {
    return this.userService.createUser(userInfo);
  }
}
