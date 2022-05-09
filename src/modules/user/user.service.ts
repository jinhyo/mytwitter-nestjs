import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { CreateUserDTO } from './dtos/createUser.dto';
import axios from 'axios';
import md5 from 'md5';
import { UserRepository } from 'src/repositories/userRepository';
import {
  CREATING_AVATAR_IMG_FAILED_MSG,
  DUPLICATE_USER_EMAIL_MSG,
  DUPLICATE_USER_NICKNAME_MSG,
} from 'src/commonConstants/errorMsgs/serviceErrorMsgs';
import { AccountType } from 'src/enums/accountType.enum';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(userInfo: CreateUserDTO): Promise<User> {
    await this.checkDuplicateEmail(userInfo);

    await this.checkDuplicateNickname(userInfo);

    const avatarURL = await this.createInitialAvatar(userInfo.email);

    return await this.userRepository.createUser(
      userInfo,
      AccountType.Local,
      avatarURL,
    );
  }

  private async checkDuplicateNickname(userInfo: CreateUserDTO) {
    const userWithSameNickname = await this.userRepository.findUserByNickname(
      userInfo.nickname,
      {
        select: ['id'],
      },
    );

    if (userWithSameNickname) {
      throw new ConflictException(DUPLICATE_USER_NICKNAME_MSG);
    }
  }

  private async checkDuplicateEmail(userInfo: CreateUserDTO) {
    const userWithSameEmail = await this.userRepository.findUserByEmail(
      userInfo.email,
      AccountType.Local,
      {
        select: ['id'],
      },
    );

    if (userWithSameEmail) {
      throw new ConflictException(DUPLICATE_USER_EMAIL_MSG);
    }
  }

  private async createInitialAvatar(email: string) /* : Promise<string> */ {
    try {
      const {
        config: { url: avatarURL },
      } = await axios.get(
        `http://gravatar.com/avatar/${md5(email)}?d=identicon`,
      );

      console.log(
        '🚀 ~ file: user.service.ts ~ line 72 ~ UserService ~ createInitialAvatar ~ avatarURL',
        avatarURL,
      );

      return avatarURL;
    } catch (error) {
      throw new InternalServerErrorException(CREATING_AVATAR_IMG_FAILED_MSG);
    }
  }
}
