import { InternalServerErrorException, Logger } from '@nestjs/common';
import {
  CREATING_USER_FAILED_MSG,
  FINDING_USER_FAILED_MSG,
  UPDATING_USER_INFO_FAILED_MSG,
} from 'src/commonConstants/errorMsgs/repositoryErrorMsgs';
import { User } from 'src/entities/user.entity';
import { AccountType } from 'src/enums/accountType.enum';
import { makeQuerySelector } from 'src/libs/makeQuerySelector.lib';
import { CreateUserDTO } from 'src/modules/user/dtos/createUser.dto';
import { UserSearchOption } from 'src/modules/user/types/userSearchOption.interface';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly logger = new Logger('UserRepository');
  private readonly entityName = User.name;

  async createUser(
    userInfo: CreateUserDTO,
    accountType: AccountType,
    avatarURL: string,
  ): Promise<User> {
    const user = this.create({ ...userInfo, accountType, avatarURL });

    try {
      return await this.save(user);
    } catch (error) {
      this.logger.error(
        `createUser() failed - error detail : ${error.message}`,
      );
      throw new InternalServerErrorException(CREATING_USER_FAILED_MSG);
    }
  }

  async updateUser(
    userId: number,
    userInfo: Partial<User>,
  ): Promise<void | never> {
    try {
      await this.update(userId, userInfo);
    } catch (error) {
      this.logger.error(
        `updateUser() failed - error detail : ${error.message}`,
      );
      throw new InternalServerErrorException(UPDATING_USER_INFO_FAILED_MSG);
    }
  }

  async findUserByEmail(
    email: string,
    accountType: AccountType,
    findOption: UserSearchOption = null,
  ): Promise<User | never> {
    const query = this.createQueryBuilder(this.entityName).where({
      email,
      accountType,
    });

    if (findOption?.select) {
      const userSelector = makeQuerySelector(
        this.entityName,
        findOption.select,
      );
      query.select(userSelector);
    }

    try {
      return await query.getOne();
    } catch (error) {
      this.logger.error(
        `findUserByEmail() failed - error detail : ${error.message}`,
      );
      throw new InternalServerErrorException(FINDING_USER_FAILED_MSG);
    }
  }

  async findUserByNickname(
    nickname: string,
    findOption: UserSearchOption = null,
  ): Promise<User | never> {
    const query = this.createQueryBuilder(this.entityName).where({ nickname });

    if (findOption?.select) {
      const userSelector = makeQuerySelector(
        this.entityName,
        findOption.select,
      );
      query.select(userSelector);
    }

    try {
      return await query.getOne();
    } catch (error) {
      this.logger.error(
        `findUserByNickname() failed - error detail : ${error.message}`,
      );
      throw new InternalServerErrorException(FINDING_USER_FAILED_MSG);
    }
  }

  async findUserById(
    userId: number,
    findOption: UserSearchOption = null,
  ): Promise<User | never> {
    const query = this.createQueryBuilder(this.entityName).where({
      id: userId,
    });

    if (findOption?.select) {
      const userSelector = makeQuerySelector(
        this.entityName,
        findOption.select,
      );
      query.select(userSelector);
    }

    try {
      return await query.getOne();
    } catch (error) {
      this.logger.error(
        `findUserById() failed - error detail : ${error.message}`,
      );

      throw new InternalServerErrorException(FINDING_USER_FAILED_MSG);
    }
  }
}
