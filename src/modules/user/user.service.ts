import { ConflictException, Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { createUserDTO } from './dtos/createUser.dto';
import axios from 'axios';
import md5 from 'md5';
import { UserRepository } from 'src/repositories/userRepository';
import {
  DUPLICATE_USER_EMAIL,
  DUPLICATE_USER_NICKNAME,
} from 'src/commonConstants/errorMsgs/serviceErrorMsgs';
import { AccountType } from 'src/enums/accountType.enum';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(userInfo: createUserDTO): Promise<User> {
    // 중복 이메일 검사
    const userWithSameEmail = await this.userRepository.findUserByEmail(
      userInfo.email,
      AccountType.Local,
      {
        select: ['id'],
      },
    );

    if (userWithSameEmail) {
      throw new ConflictException(DUPLICATE_USER_EMAIL);
    }

    // 중복 닉네임 검사
    const userWithSameNickname = await this.userRepository.findUserByNickname(
      userInfo.nickname,
      {
        select: ['id'],
      },
    );

    if (userWithSameNickname) {
      throw new ConflictException(DUPLICATE_USER_NICKNAME);
    }

    // 초기 아바타 생성
    const {
      config: { url: avatarURL },
    } = await axios.get(
      `http://gravatar.com/avatar/${md5(userInfo.email)}?d=identicon`,
    );

    const user = this.userRepository.create({
      ...userInfo,
      accountType: AccountType.Local,
      avatarURL,
    });

    return await this.userRepository.createUser(user);
  }
}
