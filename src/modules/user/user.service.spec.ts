import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  CREATING_AVATAR_IMG_FAILED_MSG,
  DUPLICATE_USER_EMAIL_MSG,
  DUPLICATE_USER_NICKNAME_MSG,
} from 'src/commonConstants/errorMsgs/serviceErrorMsgs';
import { AccountType } from 'src/enums/accountType.enum';
import { UserRepository } from 'src/repositories/userRepository';
import { CreateUserDTO } from './dtos/createUser.dto';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import axios from 'axios';

const mockUserRepository = () => ({
  findUserByEmail: jest.fn(),
  findUserByNickname: jest.fn(),
  createUser: jest.fn(),
});

type MockRepository<T> = Partial<Record<keyof T, jest.Mock>>;

describe('UserService', () => {
  let userService: UserService;
  let userRepository: MockRepository<UserRepository>;

  beforeEach(async () => {
    axios.get = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository(),
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(UserRepository));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    const newUserInfo: CreateUserDTO = {
      email: 'test@naver.com',
      nickname: 'test',
      password: 'test1234',
      selfIntro: null,
      location: null,
    };

    it('중복 이메일이 있을 경우 실패 ', async () => {
      const TARGET_USER_ID = 1;
      const targetUser = { id: TARGET_USER_ID };

      userRepository.findUserByEmail.mockResolvedValue(targetUser);

      try {
        await userService.createUser(newUserInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(DUPLICATE_USER_EMAIL_MSG);
      }

      expect(userRepository.findUserByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(
        newUserInfo.email,
        AccountType.Local,
        { select: ['id'] },
      );
    });

    it('중복 닉네임이 있을 경우 실패', async () => {
      const TARGET_USER_ID = 1;
      const targetUser = { id: TARGET_USER_ID };

      userRepository.findUserByNickname.mockResolvedValue(targetUser);
      try {
        await userService.createUser(newUserInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(DUPLICATE_USER_NICKNAME_MSG);
      }

      expect(userRepository.findUserByNickname).toHaveBeenCalledTimes(1);
      expect(userRepository.findUserByNickname).toHaveBeenCalledWith(
        newUserInfo.nickname,
        { select: ['id'] },
      );
    });

    it('아바타 생성 실패', async () => {
      axios.get = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      try {
        await userService.createUser(newUserInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe(CREATING_AVATAR_IMG_FAILED_MSG);
      }

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(expect.any(String));
    });

    it('신규 유저 생성 성공', async () => {
      userRepository.findUserByEmail.mockResolvedValue(undefined);
      userRepository.findUserByNickname.mockResolvedValue(undefined);

      const AVATAR_URL = 'http://.....';
      axios.get = jest.fn().mockResolvedValue({
        config: { url: AVATAR_URL },
      });

      const NEW_USER = 'new user';
      userRepository.createUser.mockResolvedValue(NEW_USER);

      const result = await userService.createUser(newUserInfo);

      expect(userRepository.createUser).toHaveBeenCalledTimes(1);
      expect(userRepository.createUser).toHaveBeenCalledWith(
        newUserInfo,
        AccountType.Local,
        AVATAR_URL,
      );

      expect(result).toEqual(NEW_USER);
    });
  });
});
