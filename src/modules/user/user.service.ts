import {
  BadRequestException,
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
  NO_SUCH_EMAIL_USER_MSG,
} from 'src/commonConstants/errorMsgs/serviceErrorMsgs';
import { AccountType } from 'src/enums/accountType.enum';
import { LoginDTO } from './dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { MyJwtService } from '../my-jwt/my-jwt.service';
import { AvailableDTO } from 'src/commonDTOs/available.dto';
import { changeProfileInfoDTO } from './dtos/changeProfileInfo.dto';
import { SuccessDTO } from 'src/commonDTOs/success.dto';
import { S3Service } from '../S3/S3.service';
import { FileUpload } from 'graphql-upload';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly myJwtService: MyJwtService,
    private readonly s3Service: S3Service,
  ) {}

  async createUser(userInfo: CreateUserDTO): Promise<User> {
    await this.checkDuplicateEmail(userInfo.email);

    await this.checkDuplicateNickname(userInfo.nickname);

    const avatarURL = await this.createInitialAvatar(userInfo.email);

    return await this.userRepository.createUser(
      userInfo,
      AccountType.Local,
      avatarURL,
    );
  }

  async login({ email, password }: LoginDTO, res: Response): Promise<User> {
    const user = await this.userRepository.findUserByEmail(
      email,
      AccountType.Local,
    );

    this.isExistenUserEmail(user);

    await user.isCorrectPwd(password);
    user.password = undefined;

    const jwtToken = this.myJwtService.createJwtToken(user.id);

    this.setCookieWithJwt(res, jwtToken);

    return user;
  }

  async isDuplicateNickname(nickname: string): Promise<AvailableDTO> {
    const existingNickname = await this.userRepository.findUserByNickname(
      nickname,
      { select: ['id'] },
    );

    return { isAvailable: existingNickname ? false : true };
  }

  async isDuplicateEmail(email: string): Promise<AvailableDTO> {
    const existingEmail = await this.userRepository.findUserByEmail(
      email,
      AccountType.Local,
      { select: ['id'] },
    );

    return { isAvailable: existingEmail ? false : true };
  }

  async changeProfileInfo(
    loginUserId: number,
    userInfo: changeProfileInfoDTO,
  ): Promise<SuccessDTO> {
    await this.checkDuplicateNickname(userInfo.nickname);

    await this.userRepository.updateUser(loginUserId, { ...userInfo });

    return { isSuccess: true };
  }

  async changeAvatarImg(
    userId: number,
    imgFile: FileUpload,
  ): Promise<SuccessDTO> {
    const avatarURL = await this.s3Service.uploadAvatarImg(userId, imgFile);

    await this.userRepository.updateUser(userId, { avatarURL });

    return { isSuccess: true };
  }

  // PRIVATE FUNCTIONS

  /** @desc 중복 닉네임 인지 확인 */
  private async checkDuplicateNickname(
    nickname: string,
  ): Promise<void | never> {
    const userWithSameNickname = await this.userRepository.findUserByNickname(
      nickname,
      {
        select: ['id'],
      },
    );

    if (userWithSameNickname) {
      throw new ConflictException(DUPLICATE_USER_NICKNAME_MSG);
    }
  }

  /** @desc 중복 이메일 인지 확인 */
  private async checkDuplicateEmail(email: string): Promise<void | never> {
    const userWithSameEmail = await this.userRepository.findUserByEmail(
      email,
      AccountType.Local,
      {
        select: ['id'],
      },
    );

    if (userWithSameEmail) {
      throw new ConflictException(DUPLICATE_USER_EMAIL_MSG);
    }
  }

  /** @desc 초기 아바타 사진 생성 */
  private async createInitialAvatar(email: string): Promise<string | never> {
    try {
      const {
        config: { url: avatarURL },
      } = await axios.get(
        `http://gravatar.com/avatar/${md5(email)}?d=identicon`,
      );

      return avatarURL;
    } catch (error) {
      throw new InternalServerErrorException(CREATING_AVATAR_IMG_FAILED_MSG);
    }
  }

  /** @desc 가입된 이메일인지 확인 */
  private isExistenUserEmail(user: User): void | never {
    if (!user) {
      throw new BadRequestException(NO_SUCH_EMAIL_USER_MSG);
    }
  }

  /** @desc 쿠키에 jwt 토큰 추가 */
  private setCookieWithJwt(res: Response, token: string): void {
    const NODE_ENV = this.configService.get('NODE_ENV');

    const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7;
    const TWELVE_HOURS = 1000 * 60 * 60 * 12;

    res.cookie('token', token, {
      httpOnly: true,
      secure: NODE_ENV === 'dev' ? false : true,
      maxAge: NODE_ENV === 'dev' ? SEVEN_DAYS : TWELVE_HOURS,
    });
  }
}
