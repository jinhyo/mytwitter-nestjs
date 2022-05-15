import {
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { AvailableDTO } from 'src/commonDTOs/available.dto';
import { SuccessDTO } from 'src/commonDTOs/success.dto';
import { LoginUser } from 'src/decorators/loginUser.decorator';
import { User } from 'src/entities/user.entity';
import { UserRelation } from 'src/entities/userRelation.entity';
import { LoginGuard } from 'src/guards/login.guard';
import { ImageFileValidationPipe } from 'src/pipes/imageFileValidation.pipe';
import { changeProfileInfoDTO } from './dtos/changeProfileInfo.dto';
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

  @Mutation(() => User)
  createUser(@Args('userInfo') userInfo: CreateUserDTO): Promise<User> {
    return this.userService.createUser(userInfo);
  }

  @Mutation(() => AvailableDTO)
  isDuplicateNickname(
    @Args('nickname') nickname: string,
  ): Promise<AvailableDTO> {
    return this.userService.isDuplicateNickname(nickname);
  }

  @Mutation(() => AvailableDTO)
  isDuplicateEmail(@Args('email') email: string): Promise<AvailableDTO> {
    return this.userService.isDuplicateEmail(email);
  }

  @Mutation(() => SuccessDTO)
  @UseGuards(LoginGuard)
  changeProfileInfo(
    @LoginUser('id') loginUserId: number,
    @Args('userInfo') userInfo: changeProfileInfoDTO,
  ): Promise<SuccessDTO> {
    return this.userService.changeProfileInfo(loginUserId, userInfo);
  }

  @Mutation(() => SuccessDTO)
  @UseGuards(LoginGuard)
  changeAvatarImg(
    @LoginUser('id') loginUserId: number,
    @Args(
      { name: 'avatarImg', type: () => GraphQLUpload },
      new ImageFileValidationPipe({ fileSize: 10 * 1024 * 1024 }),
    )
    imgFile: FileUpload,
  ): Promise<SuccessDTO> {
    return this.userService.changeAvatarImg(loginUserId, imgFile);
  }

  @Mutation(() => UserRelation)
  @UseGuards(LoginGuard)
  followUser(
    @LoginUser('id') loginUserId: number,
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<UserRelation> {
    return this.userService.followUser(loginUserId, userId);
  }

  @Mutation(() => SuccessDTO)
  @UseGuards(LoginGuard)
  unFollowUser(
    @LoginUser('id') loginUserId: number,
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<SuccessDTO> {
    return this.userService.unFollowUser(loginUserId, userId);
  }
}
